import gpxpy
import datetime
from garminconnect import Garmin
from flask import Flask, jsonify, request
from flask_cors import CORS
import io
import concurrent.futures

app = Flask(__name__)
CORS(app)

def init_api(username, password):
    api = Garmin(username, password)
    api.login()
    return api

api = init_api("grantwass123@icloud.com", "Exposed4!?")

api_sessions = {}


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