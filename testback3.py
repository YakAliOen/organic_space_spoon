import datetime
from cs50 import SQL

db = SQL("sqlite:///data.db")

PAST_PAPER_ROOT = "https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/"

SUBJECT_CODES = {
    "Accounting": "9706",
    "Biology": "9700",
    "Business": "9609",
    "Chemistry": "9701",
    "Computer Science": "9618",
    "Economics": "9708",
    "English": "8021",
    "Mathematics": "9709",
    "Physics": "9702"
}

SERIES_MAP = {
    "FM": "m",
    "MJ": "s",
    "ON": "w"
}

def build_past_paper_url(subject, series, year, paper):
    code = SUBJECT_CODES.get(subject)
    if not code:
        return None

    series_letter = SERIES_MAP.get(series.upper())
    if not series_letter:
        return None

    year = int(year)
    paper = str(paper).zfill(2)

    file_name = f"{code}_{series_letter}{str(year)[2:]}_qp_{paper}.pdf"
    return PAST_PAPER_ROOT + file_name


def save_entry(subject, series, year, paper):
    url = build_past_paper_url(subject, series, year, paper)
    if not url:
        return None

    db.execute(
        "INSERT INTO papers (subject, series, year, paper, url) VALUES (?, ?, ?, ?, ?)",
        subject, series, year, paper, url
    )
    return url


def list_entries():
    return db.execute("SELECT * FROM papers ORDER BY id DESC")


def countdown(target_date_str):
    target = datetime.datetime.strptime(target_date_str, "%Y-%m-%d").date()
    today = datetime.date.today()
    return (target - today).days
