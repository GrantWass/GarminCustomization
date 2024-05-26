import datetime
from garminconnect import Garmin
import json

def init_api():
    api = Garmin("grantwass123@icloud.com", "Exposed4!?")
    api.login()
    return api

api = init_api()

startdate = datetime.datetime(2024,4,22)
enddate = datetime.datetime(2024,4,24)

def display_text(output):
    """Format API output for better readability."""

    dashed = "-" * 60
    header = f"{dashed}"
    footer = "-" * len(header)

    print(header)
    print(json.dumps(output, indent=4))
    print(footer)


# Get activities data from startdate 'YYYY-MM-DD' to enddate 'YYYY-MM-DD', with (optional) activitytype
# Possible values are: cycling, running, swimming, multi_sport, fitness_equipment, hiking, walking, other
activities = api.get_activities_by_date(
    startdate.isoformat(), enddate.isoformat(), "running"
)

# Download activities
for activity in activities:
    activity_id = activity["activityId"]
    activity_name = activity["activityName"]
    display_text(activity)

    print(
        f"api.download_activity({activity_id}, dl_fmt=api.ActivityDownloadFormat.GPX)"
    )
    gpx_data = api.download_activity(
        activity_id, dl_fmt=api.ActivityDownloadFormat.GPX
    )
    output_file = f"./{str(activity_name)}.gpx"
    with open(output_file, "wb") as fb:
        fb.write(gpx_data)
    print(f"Activity data downloaded to file {output_file}")

    print(
        f"api.download_activity({activity_id}, dl_fmt=api.ActivityDownloadFormat.TCX)"
    )
    tcx_data = api.download_activity(
        activity_id, dl_fmt=api.ActivityDownloadFormat.TCX
    )
    output_file = f"./{str(activity_name)}.tcx"
    with open(output_file, "wb") as fb:
        fb.write(tcx_data)
    print(f"Activity data downloaded to file {output_file}")

    print(
        f"api.download_activity({activity_id}, dl_fmt=api.ActivityDownloadFormat.ORIGINAL)"
    )
    zip_data = api.download_activity(
        activity_id, dl_fmt=api.ActivityDownloadFormat.ORIGINAL
    )
    output_file = f"./{str(activity_name)}.zip"
    with open(output_file, "wb") as fb:
        fb.write(zip_data)
    print(f"Activity data downloaded to file {output_file}")

    print(
        f"api.download_activity({activity_id}, dl_fmt=api.ActivityDownloadFormat.CSV)"
    )
    csv_data = api.download_activity(
        activity_id, dl_fmt=api.ActivityDownloadFormat.CSV
    )
    output_file = f"./{str(activity_name)}.csv"
    with open(output_file, "wb") as fb:
        fb.write(csv_data)
    print(f"Activity data downloaded to file {output_file}")