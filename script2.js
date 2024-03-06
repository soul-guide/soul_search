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
                    searchSpiritualTexts(query);
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

function adjustIconHeight() {
    var searchBarHeight = document.getElementById('search-input').offsetHeight;
    document.getElementById('search-icon').style.height = searchBarHeight + 'px';
}

// Adjust the icon height on window resize to ensure responsiveness
window.onresize = adjustIconHeight;

// Function to generate question buttons
function generateQuestionButtons() {
    let questions = JSON.parse(document.getElementById('soulsearch').getAttribute('questions'))
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


// Function to handle search - Make sure this is defined or updated to reflect any existing search functionality
function searchSpiritualTexts(query) {
    document.getElementById('search-input').value = query; // Update search input value
    document.getElementById('search-results').innerHTML = `<p>Search results for "${query}"</p>`; // Placeholder for search results
}

// Generate question buttons on page load
window.onload = () => {
    loadHtml('https://soulguide.github.io/soul-search/index2.html')
      .then(loadingItems)
    //   .then(grabVars)
      .catch(error => console.error('Error in loadHtml or performSearch:', error));
};

function updateText(){
    let title = document.getElementById('soulsearch').getAttribute('title')
    let subtitle = document.getElementById('soulsearch').getAttribute('subtitle')
    document.getElementById('soulsearch-title').innerHTML = title;
    document.getElementById('soulsearch-subtitle').innerHTML = subtitle;
}

function getSources(){
    let sources = JSON.parse(document.getElementById('soulsearch').getAttribute('sources'))
    console.log(sources)
}

function loadingItems(){
    generateQuestionButtons();
    adjustIconHeight(); // Call previously defined functions if necessary
    const randomThemeIndex = Math.floor(Math.random() * colorThemes.length);
    applyColorTheme();
    updateText();
    getSources();
    performSearch();
}

function sendToSearch(query){
    console.log(query)
    if (!query){
        return null
    }
     var queryEncoded = encodeURIComponent(query)
     var url = location.protocol + '//' + location.host + location.pathname
     //window.location.href = `https://soulguide.ai/testing-ground?q=${queryEncoded}`;
    //var sources = addSources();
    // var sources = document.querySelector('input[name="source"]:checked').value;
    var sources = JSON.parse(document.getElementById('soulsearch').getAttribute('sources'))
    console.log(`raw sources: ${sources}`)
    var sourcesEncoded = encodeURIComponent(sources);
    var finalUrl = `${url}?q=${queryEncoded}&s=${sources}`;
    // if (menuOnGlobal){
    //     finalUrl = finalUrl + `&m=y`
    // }
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
    var source = result.source
    var reference = result.reference
    var text = result.text
    var cta = result.cta
    // var guide = result.guide.response
    const resultItem = document.createElement('div');

    var masterclass_name = result.title.replace(/\s/g, "_").toLowerCase()
    var module_number = result.section
    var segment_number = result.number
    console.log('media_type')
    console.log(type)

    if (type == 'text'){
        //display text results
        return
    }

    //else, display for audio or video
    var extension = 'mp4'
    if (type == "audio"){
        extension = 'mp3'
    }
    var source_location = `TBD`

    
    var embedCode = `<video width="640" controls src="${source_location}" type='video/mp4' /></video>`
    if (type == "audio"){
        embedCode = `<audio controls><source src="${source_location}" type="audio/mpeg"></audio>`
    }
    var button_cta = 'Explore This Program'
    var url = new URL(window.location);
    var question = decodeURIComponent(url.searchParams.get("q"))
    var cta_full = buildUrl(cta, [`soulsearch=${question}`,'affiliate_id=sg']) 
    var signup = `<a href="${cta_full}" target="_blank" class="cta-button">${button_cta}</a>`
    resultItem.innerHTML = `<div class="centered-content">
    <img src="${result.header_image_url}" width="100%">
    <h3 style="text-align:center">A Segment from Module ${result.section}</h3>
    ${embedCode}
    ${signup}
    </div>`     ;
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.appendChild(resultItem);

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

    document.getElementById("loader").style.display = "inline-block"
    document.getElementById("search-results").style.display = "none"

    var body = {
        query: searchTerm,
        sources: sources,
        numberResults: 1,
        display_sources: true,
        url : url,
        // guide: true
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

function api_call(){

}

const colorThemes = [
    {type: 'light', primaryColor: '#fbf8f0', secondaryColor: '#42234e', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Purple.svg"},
    {type: 'dark', primaryColor: '#42234e', secondaryColor: '#fbf8f0', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Orange.svg"},
    {type: 'light', primaryColor: '#FFFFFF', secondaryColor: '#222222', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Black.svg"},
    {type: 'dark', primaryColor: '#222222', secondaryColor: '#FFFFFF', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Orange.svg"},

]

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
    searchIcon.src = theme.icon_url;

    //Search Input
    const searchInput = document.getElementById('search-input'); // Reference to the input field
    searchInput.style.backgroundColor = theme.primaryColor; // Assuming your theme object includes this property
    searchInput.style.color = theme.secondaryColor; // Set input text color

    //Widget border
    const soulSearchWrapper = document.getElementById('soulsearch');
    soulSearchWrapper.borderColor = theme.secondaryColor

}
