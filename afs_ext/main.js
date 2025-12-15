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
}

const SUBJECT_NAMES = Object.keys(SUBJECTS)

const PAST_PAPER_URL = "https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/"

const SERIES = {
    "fm" : "m",
    "mj" : "s",
    "on" : "w"
}

const MF19 = "https://www.cambridgeinternational.org/Images/417318-list-of-formulae-and-statistical-tables.pdf"
const PSEUDO = "https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s25_in_22.pdf"


let this_user_pref = {};

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function main()
{
    themeToggle.addEventListener('click', async () => {
    // Toggle the Tailwind 'dark' class on the root element
    html.classList.toggle('dark');
    
    let newTheme;

    if (html.classList.contains('dark')) {
        newTheme = 'dark';
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        newTheme = 'light';
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }

    // Save the new theme preference asynchronously
    try {
        await chrome.storage.local.set({ theme: newTheme });
        console.log(`Theme toggled and saved as: ${newTheme}`);
    } catch (error) {
        console.error("Error saving theme to storage:", error);
    }
    }); 

    // Tab Functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        // Remove active class from all tabs
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.classList.remove('border-blue-600', 'dark:border-blue-400');
          b.classList.add('border-transparent');
          b.querySelector('span').classList.remove('text-blue-600', 'dark:text-blue-400');
          b.querySelector('span').classList.add('text-gray-500', 'dark:text-gray-400');
        });
        
        // Add active class to clicked tab
        btn.classList.add('active', 'border-blue-600', 'dark:border-blue-400');
        btn.classList.remove('border-transparent');
        btn.querySelector('span').classList.remove('text-gray-500', 'dark:text-gray-400');
        btn.querySelector('span').classList.add('text-blue-600', 'dark:text-blue-400');
        
        // Hide all tab contents
        tabContents.forEach(content => content.classList.add('hidden'));
        
        // Show target tab content
        document.getElementById(`${targetTab}-content`).classList.remove('hidden');
      });
    });


    // show subjects
    const container = document.getElementById('subj_choices');
    
    SUBJECT_NAMES.forEach(sub => {
        const label = document.createElement('label');
        label.className = 'flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors';
        
        const checkbox = document.createElement('input');
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

    const subjects_json = localStorage.getItem('savedSubjects');
    if (subjects_json)
    {
        // 2. Convert the JSON string back into a JavaScript array
        const subjects_arr = JSON.parse(subjects_json);
        
        // 3. Now you can use this array to populate your dropdown!
        const select_element = document.getElementById('exam_subj');
        
        subjects_arr.forEach(subject => {
            const new_option = document.createElement('option');
            new_option.value = subject;
            new_option.textContent = subject;
            select_element.appendChild(new_option);
        });
    } 
    else {
        console.warn('No subject data found in Local Storage.');
    }
}

async function initializeTheme() {
    if (!themeToggle || !html || !sunIcon || !moonIcon) {
        console.error("Theme toggle elements not found in the DOM.");
        return; 
    }

    try {
        // Retrieve the stored theme preference. Default to 'light' if not found.
        const result = await chrome.storage.local.get('theme');
        const currentTheme = result.theme || 'light';

        if (currentTheme === 'dark') {
            html.classList.add('dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            // Ensure the initial state is light if nothing is saved
            html.classList.remove('dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
        console.log(`Initial theme set to: ${currentTheme}`);
        
    } catch (error) {
        console.error("Error initializing theme from storage:", error);
    }
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
        url = `${PAST_PAPER_URL}${SUBJECTS[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_${action}.pdf`;
        console.log(`paper link: ${url}`);
        window.open(url, '_blank').focus();
    }
    else if (action === "qp")
    {
        chosen_paper = document.getElementById("exam_paper").value;
        url = `${PAST_PAPER_URL}${SUBJECTS[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_${action}_${chosen_paper}.pdf`;
        console.log(`paper link: ${url}`);
        window.open(url, '_blank').focus();
    }
    else if (action === "ms")
    {
        chosen_paper = document.getElementById("exam_paper").value;
        url = `${PAST_PAPER_URL}${SUBJECTS[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_${action}_${chosen_paper}.pdf`;
        console.log(`paper link: ${url}`);
        window.open(url, '_blank').focus();
    }
    else if (action === "yt")
    {
        // https://www.youtube.com/results?search_query=9709+May%2FJune+24+Paper+32
        url = `https://www.youtube.com/results?search_query=${SUBJECTS[chosen_subj]}+${chosen_series}+${chosen_year}+Paper+${chosen_paper}`;
        console.log(`paper link: ${url}`);
        window.open(url, '_blank').focus();
    }
    else if (action === "bk")
    {
        chosen_paper = document.getElementById("exam_paper").value;
        url = `${PAST_PAPER_URL}${SUBJECTS[chosen_subj]}_${SERIES[chosen_series]}${chosen_year}_${action}_${chosen_paper}.pdf`;
        processAndOpenPDF(url);
    }
}

function save_pref(event)
{
    event.preventDefault();
    
    // Get all checked checkboxes
    const checkboxes = document.querySelectorAll('#subj_choices input[type="checkbox"]:checked');
    
    // Extract the values into an array
    const selectedSubjects = Array.from(checkboxes).map(checkbox => checkbox.value);

    try 
    {
        chrome.storage.local.set({ 'userPreferences': selectedSubjects });
        console.log(`Preferences saved: ${selectedSubjects}`);
    } 
    catch (error) 
    {
        console.error('Error saving data:', error);
    }
}

async function processAndOpenPDF(file_url) 
{
    try {
        console.log('Fetching PDF file...');
        const existingPdfBytes = await fetch(file_url).then(res => res.arrayBuffer());

        // Load original PDF
        const originalPdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        const pageCount = originalPdfDoc.getPageCount();
        console.log(`Original PDF has ${pageCount} pages.`);

        // Create new PDF
        const rearrangedPdfDoc = await PDFLib.PDFDocument.create();

        // Get new page order (ASSUMED 0-BASED)
        const new_order = get_order(pageCount);

        if (!Array.isArray(new_order)) {
            throw new Error("get_order() must return an array");
        }

        // Copy pages
        for (const index of new_order) {
            if (index < 0 || index >= pageCount) {
                throw new Error(`Invalid page index: ${index}`);
            }

            const [copiedPage] =
                await rearrangedPdfDoc.copyPages(originalPdfDoc, [index-1]);

            rearrangedPdfDoc.addPage(copiedPage);
        }

        // Save
        const modifiedPdfBytes = await rearrangedPdfDoc.save();

        // Open in new tab
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const pdfUrlObject = URL.createObjectURL(blob);
        window.open(pdfUrlObject, '_blank');

    } catch (error) {
        console.error('PDF processing failed:', error);
        alert('Failed to process the PDF. Check console.');
    }
}


main();