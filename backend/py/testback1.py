import webbrowser as wb
from cs50 import get_int, get_string, SQL
import datetime

db = SQL("sqlite:///data.db")


# fm -> m
# mj -> s
# on -> w

# https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9702_m24_qp_33.pdf
PAST_PAPER_URL = "https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/"

SUBJ_CODES = {
    'Accounting': '9706',
    'Biology': '9700',
    'Business': '9609',
    'Chemistry': '9701',
    'Computer Science': '9618',
    'Economics': '9708',
    'English Language': '9093',
    'English Literature': '9695',
    'Further Mathematics': '9231',
    'Mathematics': '9709',
    'Physics': '9702',
}



SERIES = {
    "fm" : "m",
    "mj" : "s",
    "on" : "w"
}

MF19 = "https://www.cambridgeinternational.org/Images/417318-list-of-formulae-and-statistical-tables.pdf"
PSEUDO = "https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s25_in_22.pdf"

while True:
    check_subjs = db.execute("SELECT * FROM subjects")
    if len(check_subjs) == 0:
        for count, sub in enumerate(SUBJ_CODES.keys()):
            print(f"{count}) {sub}")

        subj_choice = input("Choose your subjects (e.g. Mathematics,Physics,Biology): ").title().strip().split(",")

        for i in subj_choice:
            db.execute("INSERT INTO subjects (id, subject_name) VALUES(?, ?)", SUBJ_CODES[i], i)

    else:
        print("0) Add/Remove subjects\n1) Past Papers\n2) Other\n3) Add Schedule\n4) Stop")

        user_input = get_int("Option (0/1/2/3): ")

        if user_input == 0:
            print("A) Add\nB) Remove")

            user_input2 = get_string("-> Option (A/B): ").title().strip()
            if user_input2 == "A":
                subj_choice = input("Choose a new subject(s) (e.g. Mathematics,Physics,Biology): ").title().strip().split(",")
                for i in subj_choice:
                    db.execute("INSERT INTO subjects (id, subject_name) VALUES(?, ?)", SUBJ_CODES[i], i)
            elif user_input2 == "B":
                subj_choice = input("Choose a subject(s) to remove (e.g. Mathematics,Physics,Biology): ").title().strip().split(",")
                for i in subj_choice:
                    db.execute("DELETE FROM subjects WHERE subject_name = ?", i)

        elif user_input == 1:
            k = db.execute("SELECT subject_name FROM subjects")

            user_subjs = []
            for i in k:
                user_subjs.append(i["subject_name"])

            print("Your Subjects")
            for count, i in enumerate(user_subjs):
                print(f"{count+1}) {i}")
            subj = get_string("-> Subject Name: ").title().strip()

            while subj not in user_subjs:
                subj = get_string("-> Subject Name: ").title().strip()

            series = get_string("-> Series (FM/MJ/ON): ").lower().strip()
            year = get_int("-> Year: ") - 2000
            get_wat = get_string("-> QP/MS/GT: ").lower()

            if get_wat == "gt":
                wb.open(f"{PAST_PAPER_URL}{SUBJ_CODES[subj]}_{SERIES[series]}{year}_{get_wat}.pdf")
            else:
                paper = get_int("Paper: ")
                wb.open(f"{PAST_PAPER_URL}{SUBJ_CODES[subj]}_{SERIES[series]}{year}_{get_wat}_{paper}.pdf")
            print()
        elif user_input == 2:
            print("-> A) MF19\n-> B) CS Pseudocode Insert")

            user_input2 = get_string("-> Option (A/B): ").title().strip()
            if user_input2 == "A":
                wb.open(MF19)
            elif user_input2 == "B":
                wb.open(PSEUDO)
            print()
        elif user_input == 3:
            subj = get_string("-> Subject: ")
            paper = get_int("-> Paper: ")
            test_day = datetime.datetime.strptime(get_string("-> Test date: "), "%Y-%m-%d")

            today = datetime.date.today()
            target_date = datetime.date(test_day.year, test_day.month, test_day.day)

            time_difference = target_date - today
            print(f"Your {subj}:{paper} is on {test_day.date()}, {time_difference.days} days left")
            print()
        elif user_input == 4:
            break

