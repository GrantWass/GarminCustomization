import datetime
from garminconnect import Garmin
from flask import Flask, jsonify, request
from flask_cors import CORS
import io
import concurrent.futures
import pandas as pd
from cachetools import cached, TTLCache
import hashlib
import json
from lxml import etree
import time


app = Flask(__name__)
CORS(app)
api_sessions = {}
cache = TTLCache(maxsize=100, ttl=300)  # Cache max 100 items for 5 minutes

def init_api(username, password):
    api = Garmin(username, password)
    api.login()
    return api

def make_cache_key(*args):
    """Generate a cache key from the arguments."""
    try:
        serializable_args = []
        for arg in args:
            if isinstance(arg, (list, tuple, str, int, float, bool)):
                serializable_args.append(arg)
            else:
                serializable_args.append(str(arg))
        key = json.dumps(serializable_args, sort_keys=True)
        return hashlib.md5(key.encode()).hexdigest()
    except Exception as e:
        print(f"Error generating cache key: {e}")
        raise


@cached(cache, key=make_cache_key)
def fetch_activity_data(api, activity_id):
    try:
        gpx_data = api.download_activity(
            activity_id, dl_fmt=api.ActivityDownloadFormat.GPX
        )
        return gpx_data
    except Exception as e:
        print(f"Error fetching activity data for {activity_id}: {str(e)}")
        return None

@cached(cache, key=make_cache_key)
def parse_gpx(gpx_data):
    try:
        gpx_file = io.BytesIO(gpx_data)
        tree = etree.parse(gpx_file)
        
        ns = {'gpx': 'http://www.topografix.com/GPX/1/1'}
        coords = [
            [float(point.get("lat")), float(point.get("lon"))]
            for point in tree.xpath("//gpx:trkpt", namespaces=ns)
        ]

        return coords

    except Exception as e:
        print(f"Error parsing GPX data: {str(e)}")
        return []
    
def load_points(start_date, end_date, api):
    start_time = time.time()

    activities = api.get_activities_by_date(
        start_date.isoformat(), end_date.isoformat(), 'running'
    )

    coords = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [
            executor.submit(fetch_activity_data, api, activity["activityId"])
            for activity in activities
        ]
        for future in concurrent.futures.as_completed(futures):
            gpx_data = future.result()
            if gpx_data:
                coords.extend(parse_gpx(gpx_data))

    end_time = time.time()
    total_time = end_time - start_time
    num_days = (end_date - start_date).days + 1 
    average_time_per_day = total_time / num_days if num_days > 0 else 0
    print(f"Average Time per Day: {average_time_per_day:.2f} seconds")

    return coords


@cached(cache, key=make_cache_key)
def get_activity_info(activity_id, activity_data, api):
    try:
        # Convert distance from meters to miles
        distance_miles = activity_data['distance'] * 0.000621371
        activity_name = activity_data['activityName']
        start_time_local = activity_data['startTimeLocal']

        # Split the start_time_local into date and time components
        start_date, start_time = start_time_local.split(' ')
        start_time_obj = datetime.datetime.strptime(start_time, '%H:%M:%S')
        start_time_formatted = start_time_obj.strftime('%I:%M %p')

        # Convert duration from seconds to H:MM format
        duration_seconds = activity_data['duration']
        duration_hours = duration_seconds // 3600
        duration_minutes = (duration_seconds % 3600) // 60
        duration_formatted = f"{int(duration_hours)}:{int(duration_minutes):02d}"

        # Pace per mile
        pace_seconds_per_mile = duration_seconds / distance_miles
        pace_minutes_per_mile = int(pace_seconds_per_mile // 60)
        pace_seconds_remainder = int(pace_seconds_per_mile % 60)
        pace_formatted = f"{pace_minutes_per_mile}:{pace_seconds_remainder:02d}"

        elevation_gain_feet = (
            activity_data.get('elevationGain', 0) * 3.28084
        )

        gpx_data = fetch_activity_data(api, activity_id)
        coords = parse_gpx(gpx_data)

        return {
            'activity_name': activity_name,
            'start_time': start_time_formatted,
            'distance_miles': distance_miles,
            'duration': duration_formatted,
            'pace_per_mile': pace_formatted,
            'elevation_gain_feet': elevation_gain_feet,
            'date': start_date,
            'coords': coords
        }
    except Exception as e:
        print(f"Error in get_activity_info: {str(e)}")
        return None

@cached(cache, key=make_cache_key)
def get_basic_activity_info(activity_data):
    distance_miles = activity_data['distance'] * 0.000621371
    start_time_local = activity_data['startTimeLocal']
    start_date, _ = start_time_local.split(' ')
    
    duration_seconds = activity_data['duration']
    duration = duration_seconds // 60

    elevation_gain_feet = activity_data.get('elevationGain', 0) * 3.28084

    return {
        'distance_miles': distance_miles,
        'duration': duration,
        'elevation_gain_feet': elevation_gain_feet,
        'date': start_date,
    }

@app.route('/get_points', methods=['POST'])
def get_points():
    data = request.json
    start_date_str = data.get('start_date')
    end_date_str = data.get('end_date')
    username = data.get('username')

    api = api_sessions[username]

    start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
    end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()

    points = load_points(start_date, end_date, api)
    return jsonify(points)

@app.route('/weekly_mileage', methods=['POST'])
def get_weekly_mileage():
    data = request.json
    username = data.get('username')

    api = api_sessions[username]

    today = datetime.date.today()
    startdate = today - datetime.timedelta(days=80)

    activities = api.get_activities_by_date(startdate.isoformat(), today.isoformat(), 'running')

    runs = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [
            executor.submit(get_basic_activity_info, activity)
            for activity in activities
        ]
        for future in concurrent.futures.as_completed(futures):
            activity_data = future.result()
            if activity_data:
                # Ensure date is a string formatted as needed
                if isinstance(activity_data['date'], datetime.date):
                    activity_data['date'] = activity_data['date'].strftime("%Y-%m-%d")
                runs.append(activity_data)

    runs.sort(key=lambda x: x['date'])

    result = [
        {
            'date': activity['date'],
            'miles': activity['distance_miles'],
            'elevation_gain': activity['elevation_gain_feet'],
            'duration': activity['duration']
        }
        for activity in runs
    ]
    return jsonify(result)

@app.route('/last_week_data', methods=['POST'])
def get_last_week_data():
    data = request.json
    username = data.get('username')

    api = api_sessions[username]

    today = datetime.date.today()
    startdate = today - datetime.timedelta(days=9)

    activities = api.get_activities_by_date(startdate.isoformat(), today.isoformat(), 'running')

    runs = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [
            executor.submit(get_activity_info, activity["activityId"], activity, api)
            for activity in activities
        ]
        for future in concurrent.futures.as_completed(futures):
            activity_data = future.result()
            if activity_data:
                # Convert date to datetime object if it's already a date object
                if isinstance(activity_data['date'], str):
                    activity_data['date'] = datetime.datetime.strptime(activity_data['date'], "%Y-%m-%d").date()
                runs.append(activity_data)

    runs.sort(key=lambda x: (x['date'], datetime.datetime.strptime(x['start_time'], "%I:%M %p")), reverse=True)
    for activity_data in runs:
        activity_data['date'] = activity_data['date'].strftime("%a, %B %d %Y")

    return jsonify(runs)


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    api = init_api(username, password)
    api_sessions[username] = api

    return jsonify('success')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
