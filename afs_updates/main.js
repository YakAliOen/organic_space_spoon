const IGCSE = {
    "Accounting" : "0452",
    "Additional Mathematics" : "0606",
    "Biology" : "0610",
    "Business Studies" : "0450",
    "Chemistry" : "0620",
    "Computer Science" : "0478",
    "Economics" : "0455",
    "English First Language" : "0500",
    "English Second Language" : "0510",
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


let this_user_pref = {};


function main()
{
    window.addEventListener('DOMContentLoaded', () => {
        // const subj_choices = Object.keys(A_LEVEL);

        // console.log(subj_choices);

        // const select = document.getElementById("exam_subj");
        // if (select) {
        //     subj_choices.forEach(sub =>
        //     {
        //         const option = document.createElement("option");
        //         option.value = sub;
        //         option.textContent = sub;
        //         select.appendChild(option);
        //     });
        // }

        const level_selector = document.getElementById('level_selector');

        if (level_selector) {
            const a_lvl_section = document.getElementById('a-lvl-subj');
            const igcse_section = document.getElementById('igcse-subj');
            
            level_selector.addEventListener('change', function() {
                const selectedLevel = this.value;
                
                // Hide both sections first
                if (a_lvl_section) a_lvl_section.style.display = 'none';
                if (igcse_section) igcse_section.style.display = 'none';
                
                // Show the appropriate section
                if (selectedLevel === 'alevel' && a_lvl_section) 
                {
                    a_lvl_section.style.display = 'block';
                } 
                else if (selectedLevel === 'igcse' && igcse_section) 
                {
                    igcse_section.style.display = 'block';
                }
            });
        }
    });
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
    event.preventDefault();

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

function show_subj(event)
{
    event.preventDefault();

    const action = document.getElementById('level_selector').value;

    let subj_choices;
    if (action === "igcse")
    {
        subj_choices = Object.keys(IGCSE);
    }
    else if (action === "alevel")
    {
        subj_choices = Object.keys(A_LEVEL);
    }

    const section = document.getElementById("subj-choices");
    const subjPref = document.getElementById("subj_pref");

    if (section && subj_choices)
    {
        // Clear all existing checkboxes before adding new ones
        section.innerHTML = '';
        
        subj_choices.forEach(sub =>
        {
            const div = document.createElement("div");
            div.className = 'form-check';
            
            const input = document.createElement('input');
            input.className = 'form-check-input';
            input.type = 'checkbox';
            input.value = sub;

            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.textContent = sub;

            div.appendChild(input);
            div.appendChild(label);

            section.appendChild(div);
        });

        const save_subj_button = document.getElementById("save_subj");

        save_subj_button.disabled = false;

        subjPref.style.display = 'block';
    }
}

function save_pref(event)
{
    event.preventDefault();
    
    // Get all checked checkboxes
    const checkboxes = document.querySelectorAll('#subj-choices input[type="checkbox"]:checked');
    
    // Extract the values into an array
    const selectedSubjects = Array.from(checkboxes).map(checkbox => checkbox.value);
    
    // Get the selected level
    const level = document.getElementById('level_selector').value;
    
    // Store in Chrome sync storage (replaces old preferences)
    // chrome.storage.sync.set({
    //     level: level,
    //     subjects: selectedSubjects
    // }, function() {
    //     if (chrome.runtime.lastError) {
    //         console.error('Error saving preferences:', chrome.runtime.lastError);
    //     } else {
    //         console.log('Preferences saved successfully!');
    //     }
    // });

    this_user_pref["level"] = level;
    this_user_pref["subjects"] = selectedSubjects;
    
    console.log(`Preferences saved: ${level}, ${selectedSubjects}`);
}

main();
