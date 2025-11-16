const PAST_PAPER_ROOT = "https colon slash slash pastpapers dot papacambridge dot com slash directories slash CAIE slash CAIE pastpapers slash upload slash"

const SUBJECT_CODES = {
    Accounting: "9706",
    Biology: "9700",
    Business: "9609",
    Chemistry: "9701",
    ComputerScience: "9618",
    Economics: "9708",
    English: "8021",
    Mathematics: "9709",
    Physics: "9702"
}

function buildPastPaperUrl(subject, season, year, paper) {
    const code = SUBJECT_CODES[subject]
    if (!code) {
        throw new Error("Unknown subject")
    }

    const seasonCodeMap = {
        M: "m",
        J: "s",
        O: "w"
    }

    const seasonCode = seasonCodeMap[season.toUpperCase()]
    if (!seasonCode) {
        throw new Error("Invalid season. Use M J O")
    }

    const shortYear = String(year).slice(2)
    const fileName = code + "_" + seasonCode + shortYear + "_qp_" + paper + ".pdf"

    return PAST_PAPER_ROOT + fileName
}

function countdown(targetDateStr) {
    const target = new Date(targetDateStr)
    const today = new Date()

    const oneDay = 24 * 60 * 60 * 1000
    const diff = target.getTime() - today.getTime()
    const daysLeft = Math.floor(diff / oneDay)

    return daysLeft
}
