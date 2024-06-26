import datetime
import json
import logging
import os
import sys
from getpass import getpass

import readchar
import requests
from garth.exc import GarthHTTPError

from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectConnectionError,
    GarminConnectTooManyRequestsError,
)

# Configure debug logging
# logging.basicConfig(level=logging.DEBUG)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables if defined
email = "grantwass123@icloud.com"
password = "Exposed4!?"
tokenstore = os.getenv("GARMINTOKENS") or "~/.garminconnect"
tokenstore_base64 = os.getenv("GARMINTOKENS_BASE64") or "~/.garminconnect_base64"
api = None

# Example selections and settings
today = datetime.date.today()
yesterday = today - datetime.timedelta(days=1)
startdate = today - datetime.timedelta(days=7)  # Select past week
start = 0
limit = 100
activitytype = "running"  # Possible values are: cycling, running, swimming, multi_sport, fitness_equipment, hiking, walking, other
weight = 89.6
weightunit = 'kg'

menu_options = {
    "3": f"Get activity data for '{yesterday.isoformat()}'",
    "4": f"Get activity data for '{today.isoformat()}' (compatible with garminconnect-ha)",
    "8": f"Get steps data for '{today.isoformat()}'",
    "9": f"Get heart rate data for '{today.isoformat()}'",
    "0": f"Get training readiness data for '{today.isoformat()}'",
    "-": f"Get daily step data for '{startdate.isoformat()}' to '{today.isoformat()}'",
    "/": f"Get body battery data for '{startdate.isoformat()}' to '{today.isoformat()}'",
    ".": f"Get training status data for '{today.isoformat()}'",
    "a": f"Get resting heart rate data for {today.isoformat()}'",
    "c": f"Get sleep data for '{today.isoformat()}'",
    "d": f"Get stress data for '{today.isoformat()}'",
    "g": f"Get max metric data (like vo2MaxValue and fitnessAge) for '{today.isoformat()}'",
    "h": "Get personal record for user",
    "n": f"Get activities data from start '{start}' and limit '{limit}'",
    "o": "Get last activity",
    "p": f"Download activities data by date from '{startdate.isoformat()}' to '{today.isoformat()}'",
    "r": f"Get all kinds of activities data from '{start}'",
    "x": f"Get Heart Rate Variability data (HRV) for '{today.isoformat()}'",
    "z": f"Get progress summary from '{startdate.isoformat()}' to '{today.isoformat()}' for all metrics",
    "I": f"Get activities for date '{today.isoformat()}'",
    "J": "Get race predictions",
    "K": f"Get all day stress data for '{today.isoformat()}'",
    "N": "Get user profile/settings",
    "P": "Get workouts 0-100, get and download last one to .FIT file",
    # "Q": "Upload workout from json data",
    "Z": "Remove stored login tokens (logout)",
    "q": "Exit",
}


def display_json(api_call, output):
    """Format API output for better readability."""

    dashed = "-" * 20
    header = f"{dashed} {api_call} {dashed}"
    footer = "-" * len(header)

    print(header)

    if isinstance(output, (int, str, dict, list)):
        print(json.dumps(output, indent=4))
    else:
        print(output)

    print(footer)

def display_text(output):
    """Format API output for better readability."""

    dashed = "-" * 60
    header = f"{dashed}"
    footer = "-" * len(header)

    print(header)
    print(json.dumps(output, indent=4))
    print(footer)


def get_credentials():
    """Get user credentials."""

    email = input("Login e-mail: ")
    password = getpass("Enter password: ")

    return email, password


def init_api(email, password):
    """Initialize Garmin API with your credentials."""

    try:
        # Using Oauth1 and OAuth2 token files from directory
        print(
            f"Trying to login to Garmin Connect using token data from directory '{tokenstore}'...\n"
        )

        # Using Oauth1 and Oauth2 tokens from base64 encoded string
        # print(
        #     f"Trying to login to Garmin Connect using token data from file '{tokenstore_base64}'...\n"
        # )
        # dir_path = os.path.expanduser(tokenstore_base64)
        # with open(dir_path, "r") as token_file:
        #     tokenstore = token_file.read()

        garmin = Garmin()
        garmin.login(tokenstore)

    except (FileNotFoundError, GarthHTTPError, GarminConnectAuthenticationError):
        # Session is expired. You'll need to log in again
        print(
            "Login tokens not present, login with your Garmin Connect credentials to generate them.\n"
            f"They will be stored in '{tokenstore}' for future use.\n"
        )
        try:
            # Ask for credentials if not set as environment variables
            if not email or not password:
                email, password = get_credentials()

            garmin = Garmin(email, password)
            garmin.login()
            # Save Oauth1 and Oauth2 token files to directory for next login
            garmin.garth.dump(tokenstore)
            print(
                f"Oauth tokens stored in '{tokenstore}' directory for future use. (first method)\n"
            )
            # Encode Oauth1 and Oauth2 tokens to base64 string and safe to file for next login (alternative way)
            token_base64 = garmin.garth.dumps()
            dir_path = os.path.expanduser(tokenstore_base64)
            with open(dir_path, "w") as token_file:
                token_file.write(token_base64)
            print(
                f"Oauth tokens encoded as base64 string and saved to '{dir_path}' file for future use. (second method)\n"
            )
        except (FileNotFoundError, GarthHTTPError, GarminConnectAuthenticationError, requests.exceptions.HTTPError) as err:
            logger.error(err)
            return None

    return garmin


def print_menu():
    """Print examples menu."""
    for key in menu_options.keys():
        print(f"{key} -- {menu_options[key]}")
    print("Make your selection: ", end="", flush=True)


def switch(api, i):
    """Run selected API call."""

    # Exit example program
    if i == "q":
        print("Be active, generate some data to fetch next time ;-) Bye!")
        sys.exit()

    # Skip requests if login failed
    if api:
        try:
            print(f"\n\nExecuting: {menu_options[i]}\n")

            # USER STATISTIC SUMMARIES
            if i == "3":
                # Get activity data for 'YYYY-MM-DD'
                display_json(
                    f"api.get_stats('{today.isoformat()}')",
                    api.get_stats(today.isoformat()),
                )
            elif i == "4":
                # Get activity data (to be compatible with garminconnect-ha)
                display_json(
                    f"api.get_user_summary('{today.isoformat()}')",
                    api.get_user_summary(today.isoformat()),
                )
            # USER STATISTICS LOGGED
            elif i == "8":
                # Get steps data for 'YYYY-MM-DD'
                display_json(
                    f"api.get_steps_data('{today.isoformat()}')",
                    api.get_steps_data(today.isoformat()),
                )
            elif i == "9":
                # Get heart rate data for 'YYYY-MM-DD'
                display_json(
                    f"api.get_heart_rates('{today.isoformat()}')",
                    api.get_heart_rates(today.isoformat()),
                )
            elif i == "0":
                # Get training readiness data for 'YYYY-MM-DD'
                display_json(
                    f"api.get_training_readiness('{today.isoformat()}')",
                    api.get_training_readiness(today.isoformat()),
                )
            elif i == "/":
                # Get daily body battery data for 'YYYY-MM-DD' to 'YYYY-MM-DD'
                display_json(
                    f"api.get_body_battery('{startdate.isoformat()}, {today.isoformat()}')",
                    api.get_body_battery(startdate.isoformat(), today.isoformat()),
                )
            elif i == "-":
                # Get daily step data for 'YYYY-MM-DD'
                display_json(
                    f"api.get_daily_steps('{startdate.isoformat()}, {today.isoformat()}')",
                    api.get_daily_steps(startdate.isoformat(), today.isoformat()),
                )
            elif i == ".":
                # Get training status data for 'YYYY-MM-DD'
                display_json(
                    f"api.get_training_status('{today.isoformat()}')",
                    api.get_training_status(today.isoformat()),
                )
            elif i == "a":
                # Get resting heart rate data for 'YYYY-MM-DD'
                display_json(
                    f"api.get_rhr_day('{today.isoformat()}')",
                    api.get_rhr_day(today.isoformat()),
                )
            elif i == "c":
                # Get sleep data for 'YYYY-MM-DD'
                display_json(
                    f"api.get_sleep_data('{today.isoformat()}')",
                    api.get_sleep_data(today.isoformat()),
                )
            elif i == "d":
                # Get stress data for 'YYYY-MM-DD'
                display_json(
                    f"api.get_stress_data('{today.isoformat()}')",
                    api.get_stress_data(today.isoformat()),
                )
            elif i == "g":
                # Get max metric data (like vo2MaxValue and fitnessAge) for 'YYYY-MM-DD'
                display_json(
                    f"api.get_max_metrics('{today.isoformat()}')",
                    api.get_max_metrics(today.isoformat()),
                )
            elif i == "h":
                # Get personal record for user
                display_json("api.get_personal_record()", api.get_personal_record())
            # ACTIVITIES
            elif i == "n":
                # Get activities data from start and limit
                display_json(
                    f"api.get_activities({start}, {limit})",
                    api.get_activities(start, limit),
                )  # 0=start, 1=limit
            elif i == "o":
                # Get last activity
                display_json("api.get_last_activity()", api.get_last_activity())
            elif i == "p":
                # Get activities data from startdate 'YYYY-MM-DD' to enddate 'YYYY-MM-DD', with (optional) activitytype
                # Possible values are: cycling, running, swimming, multi_sport, fitness_equipment, hiking, walking, other
                activities = api.get_activities_by_date(
                    startdate.isoformat(), today.isoformat(), activitytype
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

            elif i == "r":
                # Get activities data from start and limit
                activities = api.get_activities(start, limit)  # 0=start, 1=limit

                # Get activity splits
                first_activity_id = activities[0].get("activityId")

                display_json(
                    f"api.get_activity_splits({first_activity_id})",
                    api.get_activity_splits(first_activity_id),
                )

                # Get activity split summaries for activity id
                display_json(
                    f"api.get_activity_split_summaries({first_activity_id})",
                    api.get_activity_split_summaries(first_activity_id),
                )

                # Get activity weather data for activity
                display_json(
                    f"api.get_activity_weather({first_activity_id})",
                    api.get_activity_weather(first_activity_id),
                )

                # Get activity hr timezones id
                display_json(
                    f"api.get_activity_hr_in_timezones({first_activity_id})",
                    api.get_activity_hr_in_timezones(first_activity_id),
                )

                # Get activity details for activity id
                display_json(
                    f"api.get_activity_details({first_activity_id})",
                    api.get_activity_details(first_activity_id),
                )

                # Get gear data for activity id
                display_json(
                    f"api.get_activity_gear({first_activity_id})",
                    api.get_activity_gear(first_activity_id),
                )

                # Activity data for activity id
                display_json(
                    f"api.get_activity({first_activity_id})",
                    api.get_activity(first_activity_id),
                )

                # Get exercise sets in case the activity is a strength_training
                if activities[0]["activityType"]["typeKey"] == "strength_training":
                    display_json(
                        f"api.get_activity_exercise_sets({first_activity_id})",
                        api.get_activity_exercise_sets(first_activity_id),
                    )

            elif i == "x":
                # Get Heart Rate Variability (hrv) data
                display_json(
                    f"api.get_hrv_data({today.isoformat()})",
                    api.get_hrv_data(today.isoformat()),
                )

            elif i == "z":
                # Get progress summary
                for metric in [
                    "elevationGain",
                    "duration",
                    "distance",
                    "movingDuration",
                ]:
                    display_json(
                        f"api.get_progress_summary_between_dates({today.isoformat()})",
                        api.get_progress_summary_between_dates(
                            startdate.isoformat(), today.isoformat(), metric
                        ),
                    )

            elif i == "I":
                # Get activities for date
                display_json(
                    f"api.get_activities_fordate({today.isoformat()})",
                    api.get_activities_fordate(today.isoformat())
                )
            elif i == "J":
                # Get race predictions
                display_json(
                    f"api.get_race_predictions()",
                    api.get_race_predictions()
                )
            elif i == "K":
                # Get all day stress data for date
                display_json(
                    f"api.get_all_day_stress({today.isoformat()})",
                    api.get_all_day_stress(today.isoformat())
                )

            # WORKOUTS
            elif i == "P":
                workouts = api.get_workouts()
                # Get workout 0-100
                display_json(
                    "api.get_workouts()",
                    api.get_workouts()
                )

                # Get last fetched workout
                workout_id = workouts[-1]['workoutId']
                workout_name = workouts[-1]["workoutName"]
                display_json(
                    f"api.get_workout_by_id({workout_id})",
                    api.get_workout_by_id(workout_id))

                # Download last fetched workout
                print(
                    f"api.download_workout({workout_id})"
                )
                workout_data = api.download_workout(
                    workout_id
                )
                
                output_file = f"./{str(workout_name)}.fit"
                with open(output_file, "wb") as fb:
                    fb.write(workout_data)

                print(f"Workout data downloaded to file {output_file}")

            # elif i == "Q":
            #     display_json(
            #         f"api.upload_workout({workout_example})",
            #         api.upload_workout(workout_example))

            # Additional related calls:
            # get_menstrual_data_for_date(self, fordate: str): takes a single date and returns the Garmin Menstrual Summary data for that date
            # get_menstrual_calendar_data(self, startdate: str, enddate: str) takes two dates and returns summaries of cycles that have days between the two days

            elif i == "Z":
                # Remove stored login tokens for Garmin Connect portal
                tokendir = os.path.expanduser(tokenstore)
                print(f"Removing stored login tokens from: {tokendir}")
                
                try:
                    for root, dirs, files in os.walk(tokendir, topdown=False):
                        for name in files:
                            os.remove(os.path.join(root, name))
                        for name in dirs:
                            os.rmdir(os.path.join(root, name))
                    print(f"Directory {tokendir} removed")
                except FileNotFoundError:
                    print(f"Directory not found: {tokendir}")
                api = None

        except (
            GarminConnectConnectionError,
            GarminConnectAuthenticationError,
            GarminConnectTooManyRequestsError,
            requests.exceptions.HTTPError,
            GarthHTTPError
        ) as err:
            logger.error(err)
        except KeyError:
            # Invalid menu option chosen
            pass
    else:
        print("Could not login to Garmin Connect, try again later.")


# Main program loop
while True:
    # Display header and login
    print("\n*** Garmin Connect API Demo by cyberjunky ***\n")

    # Init API
    if not api:
        api = init_api(email, password)

    if api:
        # Display menu
        print_menu()
        option = readchar.readkey()
        switch(api, option)
    else:
        api = init_api(email, password)