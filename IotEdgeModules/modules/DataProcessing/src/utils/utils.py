import math
from datetime import datetime


def str_to_date(date_string):
    return datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S.%fZ")


def date_to_str(date):
    return datetime.strftime(date, "%Y-%m-%dT%H:%M:%S.%fZ")


def round_half_up(n, decimals=0):
    multiplier = 10 ** decimals
    return math.floor(n * multiplier + 0.5) / multiplier


def get_hours_from_seconds(seconds):
    return seconds / (60 * 60)
