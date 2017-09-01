# -*- coding: utf-8 -*-

"""
Tarbell project configuration
"""
from flask import Blueprint, g, render_template
import ftfy
import jinja2
import xlrd
from markupsafe import Markup


blueprint = Blueprint('nl-central-tracker-2017', __name__)

@blueprint.app_template_filter('jsonify')
def jsonify_filter(data):
    return Markup(json.dumps(data))



@blueprint.app_template_filter('format_date_time')
def format_date_time(date_time, format_string):
	# Convert game date from Excel-style date (it's a float) to a
	# datetime object.
	#
	# Assume datetime is 1900-based.
	# See http://www.lexicon.net/sjmachin/xlrd.html#xlrd.xldate_as_tuple-function
	datemode = 0
	date = xlrd.xldate.xldate_as_datetime(date_time, datemode)
	date = str(date) # Hacky way of dealing with datetime no JSON serializable
	return date


@blueprint.app_template_filter('team_lookup')
def team_lookup(team_code, requested_format):
	team_identifiers = {
		"cubs":{
			"abbrev": "CHC",
			"readable": "Chicago Cubs",
			"readable_short": "Cubs"
		},
		"cardinals":{
			"abbrev": "STL",
			"readable": "St. Louis Cardinals",
			"readable_short": "Cardinals"
		},
		"pirates":{
			"abbrev": "PIT",
			"readable": "Pittsburgh Pirates",
			"readable_short": "Pirates"
		},
		"brewers":{
			"abbrev": "MIL",
			"readable": "Milwaukee Brewers",
			"readable_short": "Brewers"
		},
		"astros":{
			"abbrev": "HOU",
			"readable": "Houston Astros",
			"readable_short": "Astros"
		},
	}

	# print team_code
	# print team_lookup
	# pass
	return team_identifiers[team_code][requested_format]

@blueprint.app_template_global('merge_data')
def merge_data(**sheets):
    data = []

    for name,sheet in sheets.items():
        team = {}

        team['team_name'] = name
        team['full_name'] = team_lookup(name, 'readable')
        team['history'] = team_history(sheet)
        team['current_record'] = team['history'][len(team['history']) - 1]['record']
        team['current_games_back'] = team['history'][len(team['history']) - 1]['games_back']
        team['current_division_rank'] = team['history'][len(team['history']) - 1]['division_rank']

        data.append(team)

    return data


def team_history(games):
    history = []

    for game in games:
        event = {}

        try:
            event['result'] = game['WON']
        except KeyError:
            continue

        event['game_number'] = game['GAME']
        event['opponent'] = game['OPPONENT']
        event['runs_scored'] = game['RUNS']
        event['runs_allowed'] = game['RUNS_ALLOWED']
        event['division_rank'] = game['RANK']
        event['games_above_below_500'] = game['ABOVE_500']
        event['games_back'] = game['GB'] if game['GB'] > 0 else "-"
        event['location'] = home_or_away(game)
        event['record'] = get_current_record(game)
        # event['game_date'] = excel_date(game['DATE'])

        history.append(event)

    return history

def home_or_away(game):
    try:
        game['ROAD_GAME']
        return 'away'
    except KeyError:
        return 'home'

def get_current_record(game):
	return {
		"wins": game['TOTAL_WINS'],
		"losses": game['TOTAL_LOSSES']
	}


# Google spreadsheet key
SPREADSHEET_KEY = "1P6x6kOSlFiuoRKDJTLOHnCLj8LKczgiI5-WbVzuvr8g"

# Exclude these files from publication
EXCLUDES = ['*.md', 'requirements.txt', 'node_modules', 'sass', 'js/src', 'package.json', 'Gruntfile.js']

# Spreadsheet cache lifetime in seconds. (Default: 4)
# SPREADSHEET_CACHE_TTL = 4

# Create JSON data at ./data.json, disabled by default
# CREATE_JSON = True

# Get context from a local file or URL. This file can be a CSV or Excel
# spreadsheet file. Relative, absolute, and remote (http/https) paths can be 
# used.
# CONTEXT_SOURCE_FILE = ""

# EXPERIMENTAL: Path to a credentials file to authenticate with Google Drive.
# This is useful for for automated deployment. This option may be replaced by
# command line flag or environment variable. Take care not to commit or publish
# your credentials file.
# CREDENTIALS_PATH = ""

# S3 bucket configuration
S3_BUCKETS = {
    # Provide target -> s3 url pairs, such as:
    #     "mytarget": "mys3url.bucket.url/some/path"
    # then use tarbell publish mytarget to publish to it
    
    "production": "graphics.chicagotribune.com/nl-central-tracker-2017",
    "staging": "apps.beta.tribapps.com/nl-central-tracker-2017",
}

# Default template variables
DEFAULT_CONTEXT = {
    'name': 'nl-central-tracker-2017',
    'title': 'NL Central Tracker 2017'
}