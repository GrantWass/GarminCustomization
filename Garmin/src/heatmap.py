import gpxpy
import datetime
from garminconnect import Garmin
from flask import Flask, jsonify, request
from flask_cors import CORS
import io
import concurrent.futures
import pandas as pd

app = Flask(__name__)
CORS(app)
api_sessions = {}

def init_api(username, password):
    api = Garmin(username, password)
    api.login()
    return api

def fetch_activity_data(api, activity_id):
    gpx_data = api.download_activity(
        activity_id, dl_fmt=api.ActivityDownloadFormat.GPX
    )
    return gpx_data

def parse_gpx(gpx_data):
    gpx_data_str = gpx_data.decode('utf-8')
    gpx_file = io.StringIO(gpx_data_str)
    gpx = gpxpy.parse(gpx_file)
    coords = []
    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                coords.append([float(point.latitude), float(point.longitude)])
    return coords

def load_points(start_date, end_date, api):
    activities = api.get_activities_by_date(
        start_date.isoformat(), end_date.isoformat(), 'running'
    )

    coords = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(fetch_activity_data, api, activity["activityId"])
            for activity in activities
        ]
        for future in concurrent.futures.as_completed(futures):
            gpx_data = future.result()
            if gpx_data:
                coords.extend(parse_gpx(gpx_data))
    return coords

def get_activity_info(activity_data, api):
    # Convert distance from meters to miles
    distance_miles = activity_data['distance'] * 0.000621371
    
    activity_name = activity_data['activityName']
    start_time_local = activity_data['startTimeLocal']
    
    # Split the start_time_local into date and time components
    start_date, start_time = start_time_local.split(' ')

    # Start time as HH:MM AM/PM
    start_time_obj = datetime.datetime.strptime(start_time, '%H:%M:%S')
    start_time_formatted = start_time_obj.strftime('%I:%M %p')
    
    # Convert duration from seconds to H:MM format
    duration_seconds = activity_data['duration']
    duration_hours = duration_seconds // 3600
    remaining_seconds_after_hours = duration_seconds % 3600
    duration_minutes = (duration_seconds % 3600) // 60
    remaining_seconds_after_minutes = remaining_seconds_after_hours % 60
    duration_formatted = f"{int(duration_hours)}:{int(duration_minutes):02d}:{int(remaining_seconds_after_minutes):02d}"

    # pace per mile
    pace_seconds_per_mile = duration_seconds / distance_miles
    pace_minutes_per_mile = int(pace_seconds_per_mile // 60)
    pace_seconds_remainder = int(pace_seconds_per_mile % 60)
    pace_formatted = f"{pace_minutes_per_mile}:{pace_seconds_remainder:02d}"

    if 'elevationGain' in activity_data:
        elevation_gain_feet = activity_data['elevationGain'] * 3.28084
    else:
        elevation_gain_feet = ""

    gpx_data = api.download_activity(activity_data['activityId'], dl_fmt=api.ActivityDownloadFormat.GPX)
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

def get_basic_activity_info(activity_data, api):
    # Convert distance from meters to miles
    distance_miles = activity_data['distance'] * 0.000621371
    
    start_time_local = activity_data['startTimeLocal']
    
    # Split the start_time_local into date and time components
    start_date, start_time = start_time_local.split(' ')

    
    # Convert duration from seconds to H:MM format
    duration_seconds = activity_data['duration']
    duration = duration_seconds // 60

    if 'elevationGain' in activity_data:
        elevation_gain_feet = activity_data['elevationGain'] * 3.28084
    else:
        elevation_gain_feet = 0
    
    return {
        'distance_miles': distance_miles,
        'duration': duration,
        'elevation_gain_feet': elevation_gain_feet,
        'date': start_date,
    }

def shift_week_number(week_number, current_week_number):
    if week_number < current_week_number - 52:
        return week_number + 52
    return week_number


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
    startdate = today - datetime.timedelta(days=365)
    enddate = today

    activities = api.get_activities_by_date(startdate.isoformat(), enddate.isoformat(), 'running')

    runs = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(get_basic_activity_info, activity, api)
            for activity in activities
        ]
        for future in concurrent.futures.as_completed(futures):
            activity_data = future.result()
            if activity_data:
                activity_data['date'] = datetime.datetime.strptime(activity_data['date'], '%Y-%m-%d').date()
                runs.append(activity_data)
    
    # sort dates after concurent requests speed them up
    runs.sort(key=lambda x: (x['date'] != today, abs(x['date'] - today), x['date']))

    # look to change this to add elevation and duration too
    # also need to figure out how to handle weeks in previous years
    weekly_mileage = {}
    for activity in runs:
        activity_date = activity['date']
        week_number = activity_date.isocalendar()[1]
        if week_number not in weekly_mileage:
            weekly_mileage[week_number] = 0
        weekly_mileage[week_number] += activity['distance_miles']

    current_week_number = datetime.datetime.now().isocalendar()[1]
    week_difference = 52 - current_week_number
    relative_weeks_back = []
    for week_number, mileage in weekly_mileage.items():
        relative_weeks_back.append(((week_number + week_difference) % 52, mileage))


    # relative_weeks_back = [(current_week_number - week_number, mileage) for week_number, mileage in weekly_mileage.items()]
    sorted_weeks_back = sorted(relative_weeks_back)

    print(sorted_weeks_back)

    return jsonify(sorted_weeks_back)

@app.route('/last_week_data', methods=['POST'])
def get_last_week_data():
    data = request.json
    username = data.get('username')

    api = api_sessions[username]

    today = datetime.date.today()
    startdate = today - datetime.timedelta(days=36)
    enddate = today

    activities = api.get_activities_by_date(startdate.isoformat(), enddate.isoformat(), 'running')

    runs = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(get_activity_info, activity, api)
            for activity in activities
        ]
        for future in concurrent.futures.as_completed(futures):
            activity_data = future.result()
            if activity_data:
                activity_data['date'] = datetime.datetime.strptime(activity_data['date'], '%Y-%m-%d').date()
                runs.append(activity_data)
    
    # sort dates after concurent requests speed them up
    runs.sort(key=lambda x: (x['date'] != today, abs(x['date'] - today), x['date']))
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
