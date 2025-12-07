//hardcoded sample data using your naming style
const sample_data = [
    { subject: "Mathematics A Level", paper: "June 2025 Paper 11", done: false },
    { subject: "Mathematics A Level", paper: "June 2025 Paper 12", done: false },
    { subject: "Mathematics A Level", paper: "June 2025 Paper 13", done: false },

    { subject: "Computer Science AS Level", paper: "June 2024 Paper 21", done: false },
    { subject: "Computer Science AS Level", paper: "June 2024 Paper 22", done: false },

    { subject: "Physics A Level", paper: "Nov 2023 Paper 41", done: false },
    { subject: "Physics A Level", paper: "Nov 2023 Paper 42", done: false }
];


//later used for paper counting
function group_by_subject(data)
{
    const grouped = {};

    data.forEach(item =>
    {
        if (!grouped[item.subject])
        {
            grouped[item.subject] = [];
        }

        grouped[item.subject].push(item);
    });

    return grouped;
}


//dynamic rowspan
function render_table()
{
    const tbody = document.getElementById("todo-table-body");
    tbody.innerHTML = "";

    const grouped = group_by_subject(sample_data);

    for (const subject in grouped) {
        const papers = grouped[subject];
        const rowspan = papers.length; //counts # of papers

        //rowspan implementation
        papers.forEach((entry, index) =>
        {
            const row = document.createElement("tr");

            if (index == 0)
            {
                //updating subject cell
                const subject_cell = document.createElement("td");
                subject_cell.textContent = subject;
                subject_cell.rowSpan = rowspan;
                row.appendChild(subject_cell);
            }

            //updating paper cell
            const paper_cell = document.createElement("td");
            paper_cell.textContent = entry.paper;
            row.appendChild(paper_cell);

            //updating checkbox cell
            const checkbox_cell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = entry.done;
            checkbox_cell.appendChild(checkbox);
            row.appendChild(checkbox_cell);

            //update everything
            tbody.appendChild(row);
        });
    }
}


document.addEventListener("DOMContentLoaded", render_table);
