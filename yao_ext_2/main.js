const SUBJECTS = {
    "IGCSE Accounting" : "0452",
    "AS/A Accounting" : "9706",

    "IGCSE Biology" : "0610",
    "AS/A Biology" : "9700",

    "IGCSE Business Studies" : "0450",
    "AS/A Business" : "9609",

    "IGCSE Chemistry" : "0620",
    "AS/A Chemistry" : "9701",

    "IGCSE Computer Science" : "0478",
    "AS/A Computer Science" : "9618",

    "IGCSE Economics" : "0455",
    "AS/A Economics" : "9708",

    "IGCSE English 1st Language" : "0500",
    "AS/A English Language" : "9093",

    "IGCSE English 2nd Language" : "0510",
    "AS/A English Literature": "9695",

    "IGCSE Mathematics" : "0580",
    "AS/A Mathematics" : "9709",

    "IGCSE Additional Mathematics" : "0606",
    "AS/A Further Mathematics" : "9231",

    "IGCSE Physics" : "0625",
    "AS/A Physics" : "9702"
};


const SUBJECT_NAMES = Object.keys(SUBJECTS);


const PAST_PAPER_URL = "https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/";


const SERIES = {
    "fm" : "m",
    "mj" : "s",
    "on" : "w"
};


const MF19 = "https://www.cambridgeinternational.org/Images/417318-list-of-formulae-and-statistical-tables.pdf";
const PSEUDO = "https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s25_in_22.pdf";


const STORAGE_THEME_KEY = "theme";
const STORAGE_USER_PREF_KEY = "user_preferences";
const STORAGE_BOOKMARKED_SUBJ_KEY = "bookmarked_subj";
const STORAGE_LAST_FORM_KEY = "last_paper_form";


const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');



function main()
{
    initializeTheme();

    // changing themes
    themeToggle.addEventListener('click', async () => {
        const isDark = html.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';

        if (newTheme === 'dark')
        {
            html.classList.add('dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
        else
        {
            html.classList.remove('dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }

        try
        {
            await chrome.storage.local.set({ theme: newTheme });
            console.log(`Theme toggled and saved as: ${newTheme}`);
        }
        catch (error)
        {
            console.error("Error saving theme to storage:", error);
        }
    });


    // Tab Functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    // wire clicks to the global switch_tab
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switch_tab(btn.dataset.tab));
    });

    switch_tab('past-papers-tab');



    // show subjects
    const container = document.getElementById('subj_choices');
    if (container) {
        SUBJECT_NAMES.forEach(sub => {
            const label = document.createElement('label');
            label.className = 'flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors';

            const checkbox = document.createElement('input');
            checkbox.addEventListener('change', updateSaveButtonState);
            checkbox.type = 'checkbox';
            checkbox.value = sub;
            checkbox.name = 'subjects';
            checkbox.className = 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600';

            const span = document.createElement('span');
            span.className = 'ml-2 text-sm text-gray-700 dark:text-gray-300';
            span.textContent = sub;

            label.appendChild(checkbox);
            label.appendChild(span);
            container.appendChild(label);
        });
    }


    // show user's sub choices (load and apply)
    chrome.storage.local.get([STORAGE_USER_PREF_KEY], (result) => {
        const prefs = Array.isArray(result[STORAGE_USER_PREF_KEY]) ? result[STORAGE_USER_PREF_KEY] : [];
        console.log('Loaded stored preferences:', prefs);
        applySavedPreferences(prefs);
        restoreLastFormState();
    });

    

    const subjForm = document.getElementById('subj_form');
    if (subjForm) subjForm.addEventListener('submit', save_pref);

    const papersForm = document.getElementById('papers_form');
    if (papersForm) papersForm.addEventListener('submit', open_stuff);

    populateTable();
}



async function initializeTheme()
{
    if (!themeToggle || !html || !sunIcon || !moonIcon)
    {
        console.error("Theme toggle elements not found in the DOM.");
        return;
    }

    try
    {
        const result = await chrome.storage.local.get(STORAGE_THEME_KEY);
        const currentTheme = result.theme || 'light';

        if (currentTheme === 'dark')
        {
            html.classList.add('dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
        else
        {
            html.classList.remove('dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }

        console.log(`Initial theme set to: ${currentTheme}`);
    }
    catch (error)
    {
        console.error("Error initializing theme from storage:", error);
    }
}

function switch_tab(tabName) 
{
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(b => {
        b.classList.remove('active', 'border-blue-600', 'dark:border-blue-400');
        b.classList.add('border-transparent');
        const span = b.querySelector('span');
        if (span) {
            span.classList.remove('text-blue-600', 'dark:text-blue-400');
            span.classList.add('text-gray-500', 'dark:text-gray-400');
        }
    });

    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active', 'border-blue-600', 'dark:border-blue-400');
        targetBtn.classList.remove('border-transparent');
        const span = targetBtn.querySelector('span');
        if (span) {
            span.classList.remove('text-gray-500', 'dark:text-gray-400');
            span.classList.add('text-blue-600', 'dark:text-blue-400');
        }
    }

    tabContents.forEach(content => content.classList.add('hidden'));
    document.getElementById(tabName).classList.remove('hidden');

    console.log(`Opening tab: ${tabName}`)
}

function saveLastFormState() {
    const state = {
        subject: document.getElementById('exam_subj').value,
        season: document.getElementById('exam_season').value,
        year: document.getElementById('exam_year').value,
        paper: document.getElementById('exam_paper').value
    };

    chrome.storage.local.set({ [STORAGE_LAST_FORM_KEY]: state });
}


function get_order(num_of_pages)
{
    while (num_of_pages % 4 !== 0)
    {
        num_of_pages = parseInt(prompt("Page number: "));
    }

    let page_order = new Array;

    for (let i = 1; i <= (num_of_pages / 2); i++)
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



function title_case(s)
{
    return s.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
}



function open_stuff(event)
{
    event.preventDefault();

    // robustly find which submit button was used (event.submitter supported in modern browsers)
    const submitter = event.submitter || document.activeElement;
    const action = submitter && submitter.value;

    if (!action) {
        console.error('No submit action detected');
        return;
    }

    saveLastFormState();

    const chosen_subj = document.getElementById('exam_subj').value;
    const chosen_series = document.getElementById('exam_season').value;
    const chosen_year = parseInt(document.getElementById('exam_year').value) - 2000;

    if (action === "gt")
    {
        let url = `${PAST_PAPER_URL}${SUBJECTS[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_${action}.pdf`;
        console.log(url)
        window.open(url, '_blank').focus();
    }
    else if (action === "qp")
    {
        let chosen_paper = document.getElementById("exam_paper").value;
        let url = `${PAST_PAPER_URL}${SUBJECTS[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_${action}_${chosen_paper}.pdf`;
        console.log(url)
        window.open(url, '_blank').focus();
    }
    else if (action === "ms")
    {
        let chosen_paper = document.getElementById("exam_paper").value;
        let url = `${PAST_PAPER_URL}${SUBJECTS[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_${action}_${chosen_paper}.pdf`;
        console.log(url)
        window.open(url, '_blank').focus();
    }
    else if (action === "yt")
    {
        let chosen_paper = document.getElementById("exam_paper").value;
        let url = `https://www.youtube.com/results?search_query=${SUBJECTS[chosen_subj]}+${chosen_series}+${chosen_year}+Paper+${chosen_paper}`;
        console.log(url)
        window.open(url, '_blank').focus();
    }
    else if (action === "bk")
    {
        
        let url = `${PAST_PAPER_URL}${SUBJECTS[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_qp_${chosen_paper}.pdf`;
        processAndOpenPDF(url);
    }
    else if (action === "bm")
    {
        const chosen_paper = document.getElementById("exam_paper").value;
        const id = `${SUBJECTS[chosen_subj]}${SERIES[chosen_series]}${chosen_year}qp${chosen_paper}`;
        const subj = chosen_subj;
        const paper_name = `${chosen_year + 2000} ${chosen_series.toUpperCase()} ${chosen_paper}`;

        const qp_url = `${PAST_PAPER_URL}${SUBJECTS[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_qp_${chosen_paper}.pdf`;
        const ms_url = `${PAST_PAPER_URL}${SUBJECTS[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_ms_${chosen_paper}.pdf`;
        console.log(`id:${id}, paper:${paper_name}`);

        const new_entry = {
            "id" : id,
            "subject" : subj,
            "paper": paper_name,
            "qp_url" : qp_url,
            "ms_url" : ms_url
        };

        save_bookmark(new_entry)
    
    

    }
}

function restoreLastFormState() {
    chrome.storage.local.get(STORAGE_LAST_FORM_KEY, (result) => {
        const state = result[STORAGE_LAST_FORM_KEY];
        if (!state) return;

        const subj = document.getElementById('exam_subj');
        const season = document.getElementById('exam_season');
        const year = document.getElementById('exam_year');
        const paper = document.getElementById('exam_paper');

        if (subj) subj.value = state.subject;
        if (season) season.value = state.season;
        if (year) year.value = state.year;
        if (paper) paper.value = state.paper;
    });
}

async function save_pref(event)
{
    event.preventDefault();

    const checkboxes = document.querySelectorAll('#subj_choices input[type="checkbox"]:checked');
    const selectedSubjects = Array.from(checkboxes).map(cb => cb.value);

    chrome.storage.local.set({ [STORAGE_USER_PREF_KEY]: selectedSubjects }, () => {
        if (chrome.runtime.lastError) {
            console.error('Error saving preferences:', chrome.runtime.lastError);
            return;
        }
        console.log('Preferences saved:', selectedSubjects);
        applySavedPreferences(selectedSubjects);

        // Make Past Papers the default when there are saved subjects,
        // otherwise default back to Home
        switch_tab("past-papers-tab");
    });
}

function populateExamSelect(subjects) 
{
    const select = document.getElementById('exam_subj');
    if (select)
    {
        select.innerHTML = '<option selected disabled>Choose...</option>';
        subjects.forEach(subject => {
            const new_option = document.createElement('option');
            new_option.value = subject;
            new_option.textContent = subject;
            select.appendChild(new_option);
        });
    }
}

function applySavedPreferences(savedSubjects = []) 
{
    const allCheckboxes = document.querySelectorAll('#subj_choices input[type="checkbox"]');
    allCheckboxes.forEach(cb => {
        cb.checked = savedSubjects.includes(cb.value);
        cb.addEventListener('change', updateSaveButtonState);
    });

    // populate select element
    populateExamSelect(savedSubjects);

    // update save button enabled state
    updateSaveButtonState();
}

function updateSaveButtonState() 
{
    const anyChecked = document.querySelectorAll('#subj_choices input[type="checkbox"]:checked').length > 0;
    const saveBtn = document.getElementById('save_subj');
    if (saveBtn) saveBtn.disabled = !anyChecked;
}

async function save_bookmark(new_entry)
{
    try {
        const result = await chrome.storage.local.get(STORAGE_BOOKMARKED_SUBJ_KEY);
        let currentArray = result[STORAGE_BOOKMARKED_SUBJ_KEY];

        if (Array.isArray(currentArray)) 
        {
            currentArray.push(new_entry);
        } 
        else 
        {
            console.log(`Array not found for key '${STORAGE_BOOKMARKED_SUBJ_KEY}'. Creating new array.`);
            currentArray = [new_entry];
        }

        await chrome.storage.local.set({ [STORAGE_BOOKMARKED_SUBJ_KEY]: currentArray });

        console.log('Entry successfully added to local storage array:', new_entry);
        
        // Refresh the table after saving
        switch_tab("bookmarks-tab");
        populateTable();

    } catch (error) {
        console.error('Error handling local storage array:', error);
    }
}

async function processAndOpenPDF(file_url)
{
    console.log("Trying to convert file")
    try
    {
        const existingPdfBytes = await fetch(file_url).then(res => res.arrayBuffer());

        const originalPdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        const pageCount = originalPdfDoc.getPageCount();

        const rearrangedPdfDoc = await PDFLib.PDFDocument.create();
        const new_order = get_order(pageCount);

        for (const index of new_order)
        {
            const [copiedPage] =
                await rearrangedPdfDoc.copyPages(originalPdfDoc, [index - 1]);

            rearrangedPdfDoc.addPage(copiedPage);
        }

        const modifiedPdfBytes = await rearrangedPdfDoc.save();
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const pdfUrlObject = URL.createObjectURL(blob);

        window.open(pdfUrlObject, '_blank');
    }
    catch (error)
    {
        console.error('PDF processing failed:', error);
        alert('Failed to process the PDF. Check console.');
    }
}

function populateTable() 
{
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    // FIX: Use the same key constant for both save and retrieve
    chrome.storage.local.get([STORAGE_BOOKMARKED_SUBJ_KEY], (result) => {
        // FIX: Use the constant, not hardcoded string
        const bookmarked_papers = Array.isArray(result[STORAGE_BOOKMARKED_SUBJ_KEY]) 
            ? result[STORAGE_BOOKMARKED_SUBJ_KEY] 
            : [];

        console.log("Retrieved bookmarked papers:", bookmarked_papers); // Debug log

        if (bookmarked_papers.length === 0) {
            console.log("No bookmarked papers found");
            updateEntryCount(0);
            return;
        }

        // Group data by subject
        const groupedData = {};
        bookmarked_papers.forEach(item => {
            if (!groupedData[item.subject]) 
            {
                groupedData[item.subject] = [];
            }
            groupedData[item.subject].push(item);
        });

        // Build table rows
        Object.keys(groupedData).forEach(subj => {
            const items = groupedData[subj];
            const rowspan = items.length;

            items.forEach((item, index) => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors';
                row.dataset.itemId = item.id;

                // Add subject cell only for first item in group
                if (index === 0) 
                {
                    const id_cell = document.createElement('td');
                    id_cell.rowSpan = rowspan;
                    id_cell.className = `border border-gray-300 dark:border-gray-600 px-4 py-2 align-top font-medium text-gray-700 dark:text-gray-300`;
                    id_cell.textContent = subj;
                    row.appendChild(id_cell);
                }

                // Paper description cell
                const paper_cell = document.createElement('td');
                paper_cell.className = 'border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300';
                paper_cell.textContent = item.paper;
                row.appendChild(paper_cell);

                // Actions cell with delete button
                const actionsCell = document.createElement('td');
                actionsCell.className = 'border border-gray-300 dark:border-gray-600 px-4 py-2 text-center';
                actionsCell.innerHTML = `
                    <button onclick="" class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded transition-colors" title="View">
                        MS
                    </button>
                    <button onclick="" class="px-3 py-1 text-xs bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded transition-colors" title="Edit">
                        QP
                    </button>
                    <button onclick="" class="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded transition-colors" title="Share">
                        GT
                    </button>
                    <button onclick="deleteItem('${item.id}')" class="text-red-500 hover:text-red-700 transition">
                        <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                `;
                row.appendChild(actionsCell);

                tbody.appendChild(row);
            });
        });
        console.log("Table populated successfully");
    });
}


async function deleteItem(id) 
{
    try {
        const result = await chrome.storage.local.get(STORAGE_BOOKMARKED_SUBJ_KEY);
        let currentArray = result[STORAGE_BOOKMARKED_SUBJ_KEY];

        if (Array.isArray(currentArray)) {
            // Filter out the item with matching id
            currentArray = currentArray.filter(item => item.id !== id);
            
            // Save back to storage
            await chrome.storage.local.set({ [STORAGE_BOOKMARKED_SUBJ_KEY]: currentArray });
            
            console.log('Entry deleted successfully');
            
            // Refresh the table
            populateTable();
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}



document.addEventListener('DOMContentLoaded', function() {
    main();
});
