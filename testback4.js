const PAST_PAPER_ROOT = "https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/";

const SUBJECT_CODES = {
    Accounting: "9706",
    Biology: "9700",
    Business: "9609",
    Chemistry: "9701",
    "Computer Science": "9618",
    Economics: "9708",
    English: "8021",
    Mathematics: "9709",
    Physics: "9702"
};

const SERIES_MAP = {
    FM: "m",
    MJ: "s",
    ON: "w"
};

function buildPastPaperURL(subject, series, year, paper) {
    const code = SUBJECT_CODES[subject];
    if (!code) return null;

    const seriesLetter = SERIES_MAP[series.toUpperCase()];
    if (!seriesLetter) return null;

    year = parseInt(year);
    paper = String(paper).padStart(2, "0");

    const fileName = `${code}_${seriesLetter}${String(year).slice(2)}_qp_${paper}.pdf`;
    return PAST_PAPER_ROOT + fileName;
}

const papers = [];

function saveEntry(subject, series, year, paper) {
    const url = buildPastPaperURL(subject, series, year, paper);
    if (!url) return null;

    const entry = { subject, series, year, paper, url };
    papers.push(entry);
    return url;
}

function listEntries() {
    return [...papers].reverse();
}

function countdown(targetDateStr) {
    const target = new Date(targetDateStr);
    const now = new Date();

    const diff = target.getTime() - now.setHours(0, 0, 0, 0);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export { buildPastPaperURL, saveEntry, listEntries, countdown };
