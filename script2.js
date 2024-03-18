function loadHtml(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (response.ok) return response.text();
                throw new Error('Network response was not ok.');
            })
            .then(text => {
                document.getElementById('soulsearch').innerHTML = text;
                document.getElementById('search-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    const query = document.getElementById('search-input').value;
                    sendToSearch(query)
                });
                resolve();
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                reject(error);
            });
    });
  }

const colorThemes = [
    {type: 'light', primaryColor: '#fbf8f0', secondaryColor: '#42234e', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Purple.svg"},
    {type: 'dark', primaryColor: '#42234e', secondaryColor: '#fbf8f0', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Orange.svg"},
    {type: 'light', primaryColor: '#FFFFFF', secondaryColor: '#222222', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Black.svg"},
    {type: 'dark', primaryColor: '#222222', secondaryColor: '#FFFFFF', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Orange.svg"},

]

function adjustIconHeight() {
    var searchBarHeight = document.getElementById('search-input').offsetHeight;
    document.getElementById('search-icon').style.height = searchBarHeight + 'px';
}

// Adjust the icon height on window resize to ensure responsiveness
// window.onresize = adjustIconHeight;

function decodeForHTMLAttribute(str) {
    str = str
        .replace(/&amp;/g, '&') // First, replace & to avoid double encoding
        .replace(/&quot;/g, '"') // Encode double quotes
        .replace(/&#39;/g, "'")   // Encode single quotes (apostrophes)
        .replace(/&lt;/g, '<')    // Encode less than
        .replace(/&gt;/g, '>');   // Encode greater than
    return str.split('%^%')
}

// Function to generate question buttons
function generateQuestionButtons() {
    let questions = document.getElementById('soulsearch').getAttribute('questions')
    questions = decodeForHTMLAttribute(questions)
    console.log(questions)
    if (questions != null && questions.length){
        console.log(questions)
        const container = document.getElementById('sample-questions');
        questions.forEach(question => {
            const button = document.createElement('button');
            button.textContent = question;
            // Apply the "sample-question-button" class to each button
            button.className = 'sample-question-button';
            button.addEventListener('click', () => {
                sendToSearch(question);
            });
            container.appendChild(button);
        });
    }
    
}


// Generate question buttons on page load
window.onload = () => {
    loadHtml('https://soulguide.github.io/soul-search/index2.html')
      .then(loadingItems)
      .catch(error => console.error('Error in loadHtml or performSearch:', error));
};

function updateText(){
    let title = document.getElementById('soulsearch').getAttribute('title')
    let subtitle = document.getElementById('soulsearch').getAttribute('subtitle')
    document.getElementById('soulsearch-title').innerHTML = title;
    document.getElementById('soulsearch-subtitle').innerHTML = subtitle;
}

function loadingItems(){
    generateQuestionButtons();
    // adjustIconHeight(); // Call previously defined functions if necessary
    applyColorTheme();
    updateText();
    performSearch();
}

function sendToSearch(query){
    console.log(query)
    if (!query){
        return null
    }
    var queryEncoded = encodeURIComponent(query)
    var url = location.protocol + '//' + location.host + location.pathname
    var finalUrl = `${url}?q=${queryEncoded}`;
    window.location.href = finalUrl
}

function buildUrl(fromURL, fromQuery) {
    const url = new URL(fromURL);
    
    for (queryItem of fromQuery){
        const query = new URLSearchParams(queryItem);
        console.log('query',query)
        for (const [key, value] of query) {
            console.log(key,value)
            url.searchParams.set(key, value);
        }
    }

    return url.toString().replace(/\+/g, '%20');
}

function display_result(result){
    var type = result.type
    var cta = result.cta
    // var guide = result.guide.response
    const resultItem = document.createElement('div');

    console.log('media_type')
    console.log(type)

    //else, display for audio or video
    var extension = 'mp4'
    if (type == "audio"){
        extension = 'mp3'
    }

    source_location = result.media_url
    // var source_location = `soul.search/${platform}`
    console.log(result)

    var url = new URL(window.location);
    var question = decodeURIComponent(url.searchParams.get("q"))

    const guide = document.getElementById('soulsearch').getAttribute('guide')
    chap_text = 'Module'
    if (type == 'text'){
        chap_text = 'Chapter'
    }
    var h3_text = `A Segment from ${chap_text} ${result.chapter}`
    if (result.chapter_title){
        var h3_text = `From <i>${result.chapter_title}</i>:`
    }

    let gated = document.getElementById('soulsearch').getAttribute('gated')
    var button_cta = 'Explore This Program'
    if (gated == 'false'){
        button_cta = 'Explore Similar Programs'
    }

    var embedCode = `<video width="640" controls controlsList="nodownload" playsinline src="${source_location}" type='video/mp4' id='media'/></video>`
    if (type == "audio"){
        embedCode = `<audio controls controlsList="nodownload" id="media"><source src="${source_location}" type="audio/mpeg"></audio>`
    }
    if (type == "text"){
        embedCode = `<p>${result.text}</p>`
        button_cta = 'Explore More'
    }
    
    var cta_full = buildUrl(cta, [`soulsearch=${question}`,'affiliate_id=sg']) 
    var signup = `<a href="${cta_full}" target="_blank" class="cta-button">${button_cta}</a>`
    var guide_response = result.guide
    var fullInner = ''
    if(guide_response){
        fullInner = `<p>${guide_response}</p>`
    }
    var title_label = `<div class="centered-content"><h2>${result.title}</h2>`
    if (result.header_image_url){
        title_label = `<div class="centered-content"><a href="${cta_full}" target="_blank"><img src="${result.header_image_url}" width="100%"></a>`
    }
    fullInner = fullInner + title_label
    var showh3 = ['video','audio', 'text'];
    if (showh3.includes(type)){
        fullInner = fullInner + `<h3 style="text-align:center" id="results-header">${h3_text}</h3>`
    }
    fullInner = fullInner + `
    ${embedCode}
    ${signup}
    </div>`
    resultItem.innerHTML = fullInner
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.appendChild(resultItem);

    if (gated == 'false'){
        document.getElementById('media').addEventListener('loadedmetadata', function() {
            this.currentTime = result.start;
          }, false);
    }

    //Search Input
    let themeIndex = Number(document.getElementById('soulsearch').getAttribute('theme'))
    const theme = colorThemes[themeIndex];
    const resultsHeader = document.getElementById('results-header'); // Reference to the input field
    if (resultsHeader){
        resultsHeader.style.color = theme.secondaryColor; // Set input text color
    }

    document.getElementById("search-results").style.display = "inline-block"
    document.getElementById("loader").style.display = "none"
    
}

function handle_results(results){
    // Clear previous results
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '';
    // Check if data is empty
    if (results.length === 0) {
        resultsDiv.innerHTML = 'No results found.';
        return;
    }
    for (result of results){
        display_result(result)
    }
}

function performSearch() {
    var url = new URL(window.location);
    var searchTerm = decodeURIComponent(url.searchParams.get("q"));
    if (searchTerm == 'null'){
        return null
    }

    //if search term, populate input with it
    document.getElementById('search-input').value = searchTerm

    var sources = decodeURIComponent(url.searchParams.get("s")).split(",");
    var steward = document.getElementById('soulsearch').getAttribute('steward')
    var teacher = document.getElementById('soulsearch').getAttribute('teacher')
    var guide = document.getElementById('soulsearch').getAttribute('guide')

    document.getElementById("loader").style.display = "inline-block"
    document.getElementById("search-results").style.display = "none"

    let gated = document.getElementById('soulsearch').getAttribute('gated')
    var body = {
        query: searchTerm,
        // sources: sources,
        filter:{
            steward: steward,
            teacher: teacher,
        },
        numberResults: 1,
        // display_sources: true,
        // url : url,
        gated:gated,
        guide: guide
    }
    // Perform the API call
    fetch(`https://eon0klfitimzqd5.m.pipedream.net`,
    {
        method: "POST",
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(data => {
            handle_results(data);
        })
        .catch(error => {
        console.error('Error fetching data:', error);
        });
}

function applyColorTheme() {
    let themeIndex = Number(document.getElementById('soulsearch').getAttribute('theme'))
    const theme = colorThemes[themeIndex];

    // Update widget's main background and text color
    document.querySelector('#soulsearch').style.backgroundColor = theme.primaryColor;
    document.querySelector('#soulsearch').style.color = theme.secondaryColor;

    // Update button background color and hover effects
    document.querySelectorAll('.sample-question-button').forEach(button => {
        button.style.backgroundColor = theme.secondaryColor;
        button.style.color = theme.primaryColor; // Assuming you want to change the text color too
        button.onmouseover = () => button.style.backgroundColor = theme.secondaryColor;
        button.onmouseout = () => button.style.backgroundColor = theme.secondaryColor;
    });

    // Update specific styles for .sample-question-button if needed
    document.querySelectorAll('.sample-question-button').forEach(button => {
        // Apply any specific styles for sample question buttons here
        // For example, if you want a specific border color for these buttons:
        button.style.borderColor = theme.secondaryColor;
    });

    // Insert proper icon
    const searchIcon = document.getElementById('search-icon');
    searchIcon.style.fill = theme.secondaryColor;

    //Search Input
    const searchInput = document.getElementById('search-input'); // Reference to the input field
    searchInput.style.backgroundColor = theme.primaryColor; // Assuming your theme object includes this property
    searchInput.style.color = theme.secondaryColor; // Set input text color

    //Widget border
    const soulSearchWrapper = document.getElementById('soulsearch');
    soulSearchWrapper.borderColor = theme.secondaryColor

    //Link color
    const link = document.getElementById('soulsearchlink');
    link.style.color = theme.secondaryColor

}
