const IGCSE = {
    "Accounting" : "0452",
    "Additional Mathematics" : "0606",
    "Biology" : "0610",
    "Business Studies" : "0450",
    "Chemistry" : "0620",
    "Computer Science" : "0478",
    "Economics" : "0455",
    "English Language (First Language)" : "0500",
    "English Language (Second Language)" : "0510",
    "Mathematics" : "0580",
    "Physics" : "0625",
}

const A_LEVEL = {
    "Accounting" : "9706",
    "Biology" : "9700",
    "Business" : "9609",
    "Chemistry" : "9701",
    "Computer Science" : "9618",
    "Economics" : "9708",
    "English Language" : "9093",
    "Further Mathematics" : "9231",
    "Mathematics" : "9709",
    "Physics" : "9702"
}

const PAST_PAPER_URL = "https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/"

const SERIES = {
    "fm" : "m",
    "mj" : "s",
    "on" : "w"
}

const MF19 = "https://www.cambridgeinternational.org/Images/417318-list-of-formulae-and-statistical-tables.pdf"
const PSEUDO = "https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s25_in_22.pdf"


function main()
{
    window.onload = function () 
    {
        subj_choices = Object.keys(A_LEVEL)

        console.log(subj_choices)

        const select = document.getElementById("exam_subj");

        subj_choices.forEach(sub => 
        {
            const option = document.createElement("option");
            option.value = sub;
            option.textContent = sub;
            select.appendChild(option);
        });
    };


}

function get_order(num_of_pages)
{
    while (num_of_pages % 4 !== 0)
    {
        num_of_pages = parseInt(prompt("Page number: "));
    }

    let page_order = new Array;

    for (let i = 1; i <= (num_of_pages/2); i++)
    {
        if (i % 2 === 1)
        {
            page_order.push(num_of_pages - (i - 1));
            page_order.push(i);
        }
        else
        {
            page_order.push(i);
            page_order.push(num_of_pages - (i - 1));
        }
    }

    return page_order;
}

function title_case(s) {
    return s.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
}

function open_stuff(event)
{
    event.preventDefault()

    const action = event.submitter.value;

    const chosen_subj = document.getElementById('exam_subj').value;
    const chosen_series = document.getElementById('exam_season').value;
    const chosen_year = parseInt(document.getElementById('exam_year').value) - 2000;

    if (action === "gt")
    {
        url = `${PAST_PAPER_URL}${A_LEVEL[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_${action}.pdf`;
        console.log(`paper link: ${url}`);
        window.open(url, '_blank').focus();
    }
    else if (action === "qp")
    {
        chosen_paper = document.getElementById("exam_paper").value;
        url = `${PAST_PAPER_URL}${A_LEVEL[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_${action}_${chosen_paper}.pdf`;
        console.log(`paper link: ${url}`);
        window.open(url, '_blank').focus();
    }
    else if (action === "ms")
    {
        chosen_paper = document.getElementById("exam_paper").value;
        url = `${PAST_PAPER_URL}${A_LEVEL[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_${action}_${chosen_paper}.pdf`;
        console.log(`paper link: ${url}`);
        window.open(url, '_blank').focus();
    }
}

main();
