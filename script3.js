window.onload = () => {
    warmFlow();
    loadHtml('https://soulguide.github.io/soul-search/index3.html')
      .then(loadingItems)
      .catch(error => console.error('Error in loadHtml or performSearch:', error));
};

function warmFlow(){
    fetch(`https://eon0klfitimzqd5.m.pipedream.net`,
    {
        method: "GET"
    })
}

function loadHtml(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (response.ok) return response.text();
                throw new Error('Network response was not ok.');
            })
            .then(text => {
                document.getElementById('soulsearch').innerHTML = text;
                checkNav();
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

function checkNav(){
    let soulsearch = document.getElementById('soulsearch')
    if(soulsearch.hasAttribute('navigation')){
        let carouselItems = document.getElementById('soulsearch').getAttribute('navigation')
        carouselItems = decodeForHTMLAttribute(carouselItems)
        document.getElementById("ss-nav").style.display = "block";
        addCarouselItems()
        // Attach this function to your arrow buttons
        document.getElementById('ss-next').addEventListener('click', () => moveCarousel(1));
        document.getElementById('ss-prev').addEventListener('click', () => moveCarousel(-1));
    }
}

function decodeForHTMLAttribute(str, json=false) {
    str = str
        .replace(/&amp;/g, '&') // First, replace & to avoid double encoding
        .replace(/&quot;/g, '"') // Encode double quotes
        .replace(/&#39;/g, "'")   // Encode single quotes (apostrophes)
        .replace(/&lt;/g, '<')    // Encode less than
        .replace(/&gt;/g, '>')   // Encode greater than
        .replace(/%7B;/g, '{')
        .replace(/%7D;/g, '}')
    if(!json){
        return str.split('%^%')
    }
    let array = str.split('%^%')
    let json_array = []
    for (var i = 0; i<array.length;i++){
        json_array.push(JSON.parse(array[i]))
    }
    return json_array
}

function generateQuestionButtons() {
    const container = document.getElementById('sample-questions');
    container.style.display = 'none'
    let questions = document.getElementById('soulsearch').getAttribute('questions')
    if (questions != null && questions.length){
        questions = decodeForHTMLAttribute(questions)
        container.style.display = 'flex'
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

function updateText(){
    document.getElementById('soulsearch-title').style.display ='none'
    let title = document.getElementById('soulsearch').getAttribute('title')
    let logo = document.getElementById('soulsearch').getAttribute('logo')
    if(title){
        document.getElementById('soulsearch-title').style.display ='block'
        document.getElementById('soulsearch-title').innerHTML = `<p>${title}</p>`;
    }
    if (logo){
        document.getElementById('soulsearch-title').style.display ='block'
        document.getElementById('soulsearch-title').innerHTML = `<img src="${logo}">`;
    }

    document.getElementById('soulsearch-subtitle').style.display ='none'
    let subtitle = document.getElementById('soulsearch').getAttribute('subtitle')
    if(subtitle){
        document.getElementById('soulsearch-subtitle').style.display ='block'
        document.getElementById('soulsearch-subtitle').innerHTML = `<p>${subtitle}</p>`;
    }
    
}

function loadingItems(){
    generateQuestionButtons();
    applyColorTheme();
    updateText();
    // performSearch();
}

function trigger_freeze(frozen=true){
    if(frozen){
        document.getElementById("soulsearch-inner").style.pointerEvents = "none";
        document.getElementById("soulsearch-inner").style.opacity = 0.5;
        document.getElementById("soulsearch-inner").style.transition = "filter 1.5s ease" /* Transition effect for the filter property */
        document.getElementById("soulsearch-inner").style.filter = "blur(1px)";
        return
    }
    document.getElementById("soulsearch-inner").style.pointerEvents = "auto";
    document.getElementById("soulsearch-inner").style.opacity = 1;
    document.getElementById("soulsearch-inner").style.filter = "none";
}

function sendToSearch(query){
    if (!query){
        return null
    }
    // var queryEncoded = encodeURIComponent(query)
    // var url = location.protocol + '//' + location.host + location.pathname
    // var finalUrl = `${url}?q=${queryEncoded}`;
    // const url = new URL(window.location.href);
    // url.searchParams.set('q', queryEncoded);
    // window.history.pushState(null, null, url); // or pushState
    performSearch(query)
}

function buildUrl(fromURL, fromQuery) {
    const url = new URL(fromURL);
    
    for (queryItem of fromQuery){
        const query = new URLSearchParams(queryItem);
        for (const [key, value] of query) {
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
    var h3_text = `A Segment from ${chap_text} ${result.chapter_id}`
    if(result.title == 'The Holy Bible'){
        h3_text = `${result.book} ${result.chapter_id}:${result.start}`
        if (result.end != result.start){
            h3_text = h3_text + `-${result.end}`
        }
    }
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
    

    if(cta){
        var cta_full = buildUrl(cta, [`soulsearch=${question}`,'affiliate_id=sg']) 
        var signup = `<a href="${cta_full}" target="_blank" class="cta-button">${button_cta}</a>`
    }
    
    var guide_response = result.guide
    var fullInner = ''
    if(guide_response){
        fullInner = `<p>${guide_response}</p>`
    }
    fullInner = fullInner + `<div class="centered-content">`
    var title_label = `<h2>${result.title}</h2>`
    
    if (result.header_image_url){
        title_label = `<a href="${cta_full}" target="_blank"><img src="${result.header_image_url}" width="100%"></a>`
    }
    let navigation = document.getElementById('soulsearch').getAttribute('navigation')
    let hide_title = document.getElementById('soulsearch').getAttribute('hide-title')
    if (!hide_title){
        fullInner = fullInner + title_label
    }
    var showh3 = ['video','audio', 'text'];
    if (showh3.includes(type)){
        fullInner = fullInner + `<h3 style="text-align:center" id="results-header">${h3_text}</h3>`
    }
    fullInner = fullInner + embedCode
    if (cta){
        fullInner = fullInner + signup
    }
    fullInner = fullInner + `</div>`
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

    document.getElementById("search-results").style.display = "block"
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

function performSearch(query) {
    var url = new URL(window.location);
    // var searchTerm = decodeURIComponent(url.searchParams.get("q"));
    var searchTerm = query
    if (searchTerm == 'null'){
        return null
    }

    //if search term, populate input with it
    document.getElementById('search-input').value = searchTerm

    var filter = {}
    if (document.getElementById('soulsearch').getAttribute('steward')){
        filter.steward = document.getElementById('soulsearch').getAttribute('steward')
    }
    if (document.getElementById('soulsearch').getAttribute('teacher')){
        filter.teacher = document.getElementById('soulsearch').getAttribute('teacher')
    }

    let carouselItems = document.getElementById('soulsearch').getAttribute('navigation')
    carouselItems = decodeForHTMLAttribute(carouselItems, json=true)
    var guide = document.getElementById('soulsearch').getAttribute('guide')
    let navigation = document.getElementById('soulsearch').getAttribute('navigation')
    if(navigation){
        var navItem = carouselItems[selectedItemIndex]
        filter = navItem['filter']
    }

    const element = document.getElementById('search-form');
    const height = element.offsetHeight;
    document.getElementById("loader").style.top = `${height/2}px`
    document.getElementById("loader").style.display = "inline-block"
    document.getElementById("search-results").style.display = "none"

    let gated = document.getElementById('soulsearch').getAttribute('gated')
    var body = {
        query: searchTerm,
        // sources: sources,
        filter:filter,
        numberResults: 1,
        // display_sources: true,
        // url : url,
        gated:gated,
        guide: guide
    }

    //freeze div
    trigger_freeze(frozen=true)
    // Perform the API call
    fetch(`https://eon0klfitimzqd5.m.pipedream.net`,
    {
        method: "POST",
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(data => {
            handle_results(data);
            trigger_freeze(frozen=false)
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
        button.style.borderColor = theme.secondaryColor;
    });

    // Icon fill
    const searchIcon = document.getElementById('search-icon');
    searchIcon.style.fill = theme.secondaryColor;

    //Search Input
    const searchInput = document.getElementById('search-input'); // Reference to the input field
    searchInput.style.backgroundColor = theme.primaryColor; // Assuming your theme object includes this property
    searchInput.style.color = theme.secondaryColor; // Set input text color

    //Widget border
    const frameBorder = document.getElementById('soulsearch').getAttribute('framed')
    const soulSearchWrapper = document.getElementById('soulsearch');
    soulSearchWrapper.style.border= 'none'
    console.log(frameBorder)
    if(frameBorder == 'true'){
        soulSearchWrapper.style.border = `1px solid ${theme.secondaryColor}`
    }
    
    //Link color
    const link = document.getElementById('soulsearchlink');
    link.style.color = theme.secondaryColor

    //nav button color
    document.querySelectorAll('.ss-navigate').forEach(button => {
        button.style.backgroundColor = theme.primaryColor;
        button.style.color = theme.secondaryColor; // Assuming you want to change the text color too
        // button.onmouseover = () => button.style.backgroundColor = theme.secondaryColor;
        // button.onmouseout = () => button.style.backgroundColor = theme.primaryColor;
    });

    //loader color
    const loader = document.getElementById('loader')
    
    // loader.style.borderImage = "linear-gradient(to right, red, yellow) 1 stretch"
    // loader.style.border = `16px solid ${theme.secondaryColor}`
    // loader.style.borderTop = `16px solid ${theme.primaryColor}`
}

function changeSelectedItemIndex(direction){
    let previousIndex = selectedItemIndex
    let carouselItems = document.getElementById('soulsearch').getAttribute('navigation')
    carouselItems = decodeForHTMLAttribute(carouselItems, json=true)
    if(direction > 0){
        selectedItemIndex = (selectedItemIndex - 1 + carouselItems.length) % carouselItems.length
    }
    else{
        selectedItemIndex = (selectedItemIndex + 1) % carouselItems.length
    }
    selectedItemIndex = (selectedItemIndex + 0) % carouselItems.length
    highlightCurrentItem(carouselItems[selectedItemIndex], previousItem = carouselItems[previousIndex])
    scaleOtherItems(selectedItemIndex)
    warmFlow()
}

function itemWidth(maxWidth = 150){
    // const element = document.getElementById('soulsearch');
    // const width = element.offsetWidth;
    return Math.min(frame_width / visibleItems(), maxWidth)
}
function visibleItems(){
    let carouselItems = document.getElementById('soulsearch').getAttribute('navigation')
    carouselItems = decodeForHTMLAttribute(carouselItems, json=true)
    var items = carouselItems.length
    if(items % 2){
        return Math.min(items, 5)
    }
    return Math.min(items - 1,5)
}

const frame_width = 680
var selectedItemIndex = 2
const opacity_value = 0.3;
const blur_value = 2;
const scale_value = .25;
const transition_time = 0.25;
const visible_items = visibleItems()

function highlightCurrentItem(item, previousItem = null){
    var overlay = document.getElementById(`${item.label}_overlay`)
    overlay.style.transition = `${transition_time}s ease`;
    overlay.style.opacity = 1
    overlay.style.transform  = `scale(${1 + scale_value})`
    overlay.style.filter = `blur(0px)`

}

function closestDistance(index1, index2, listLength) {
    const directDistance = Math.abs(index1 - index2);
    const moduloDistance = listLength - directDistance;
    return Math.min(directDistance, moduloDistance);
}

function scaleOtherItems(currentIndex){
    let carouselItems = document.getElementById('soulsearch').getAttribute('navigation')
    carouselItems = decodeForHTMLAttribute(carouselItems, json=true)

    for(var i = 0; i < carouselItems.length; i++){
        var item = carouselItems[i]
        var overlay = document.getElementById(`${item.label}_overlay`)
        var scaleFactor = closestDistance(currentIndex, i, carouselItems.length)
        overlay.style.opacity = 1 - opacity_value * scaleFactor
        overlay.style.transform  = `scale(${1 - scale_value * scaleFactor})`
        overlay.style.filter = `blur(${blur_value * scaleFactor}px)`
    }
}

let isTransitioning = false;
function moveCarousel(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    let carouselItems = document.getElementById('soulsearch').getAttribute('navigation')
    carouselItems = decodeForHTMLAttribute(carouselItems, json=true)
    changeSelectedItemIndex(direction)
    const carouselInner = document.querySelector('.ss-carousel-inner');
    const items = document.querySelectorAll('.ss-carousel-item');
    var item_width = itemWidth()
    // itemWidth = "120"
    
    // Apply the initial translation to start the sliding effect
    //left arrow
    if (direction === -1) {
        carouselInner.style.transition = `transform ${transition_time}s ease`;
        carouselInner.style.transform = `translateX(-${item_width}px)`;
        // Set a timeout to move the first item to the end after the transition finishes
        setTimeout(() => {
            // Remove transition, append the first item to the end, and reset the transform
            carouselInner.style.transition = 'none';
            const firstItem = carouselInner.firstElementChild;
            carouselInner.appendChild(firstItem);
            carouselInner.style.transform = 'translateX(0px)';
            isTransitioning = false;
        }, transition_time * 1000); // This timeout duration should match the CSS transition time
    }

    //right arrow 
    else if (direction === 1) {
        // Moving to the previous item, slide to the right
        // Insert the last item at the beginning before sliding
        const lastItem = carouselInner.lastElementChild;
        carouselInner.insertBefore(lastItem, carouselInner.firstElementChild);
        // Create a copy of what was the last item (now the first), representing rebirth and continuity
        const clonedLastItem = lastItem.cloneNode(true);

        // Append the cloned item to the end, allowing the cycle to perpetuate endlessly
        // carouselInner.appendChild(clonedLastItem);
        
        // Adjust the transform without transition to show the last item
        carouselInner.style.transition = 'none';
        carouselInner.style.transform = `translateX(-${item_width}px)`;

        // Force a reflow
        carouselInner.offsetWidth;

        // Add transition and slide to show the new first item
        setTimeout(() => {
            carouselInner.style.transition = `transform ${transition_time}s ease`;
            carouselInner.style.transform = 'translateX(0px)';
        }, 0);

        
    }
    setTimeout(() => {
        // Reset states and handle post-transition tasks here
        isTransitioning = false;
    }, transition_time * 1000); // Match this duration to your transition's duration
    
}

function addCarouselItems(){
    const carouselInner = document.querySelector('.ss-carousel-inner');
    const item_width = itemWidth()

    let carouselItems = document.getElementById('soulsearch').getAttribute('navigation')
    carouselItems = decodeForHTMLAttribute(carouselItems, json=true)

    // Clear the carouselInner before adding new items
    carouselInner.innerHTML = '';
    let themeIndex = Number(document.getElementById('soulsearch').getAttribute('theme'))
    const theme = colorThemes[themeIndex];

    // Iterate over the array and create a new carousel-item for each entry
    carouselItems.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'ss-carousel-item';
        carouselItem.id = item.label;
        if(item.label in public_works){
            
            var svg_code = public_works[item.label]['svg_path']
            var parser = new DOMParser();
            var doc = parser.parseFromString(svg_code, "image/svg+xml");
            var svgElement = doc.documentElement;
            svgElement.setAttribute("width", '100%');
            svgElement.setAttribute("height", '100%');

            var newColor = theme.secondaryColor
            
            // Change fill for all elements that have a fill attribute defined
            svgElement.querySelectorAll('[fill]').forEach(el => {
                if (el.getAttribute('fill') !== 'none') el.setAttribute('fill', newColor); // Change fill unless it's explicitly set to 'none'
            });


            // Overriding styles within <style> tags if any. This can be a bit complex since it involves modifying CSS text.
            svgElement.querySelectorAll('style').forEach(style => {
                var newStyle = style.innerHTML.replace(/stroke:[^;]+;/g, `stroke: ${newColor};`); // Replace stroke color
                style.innerHTML = newStyle;
            });
            
            svgElement.setAttribute("fill", theme.secondaryColor);
            // Create a new rectangle element
            const div_img = document.createElement('div')
            div_img.style.backgroundColor = theme.primaryColor;
            div_img.style.opacity = opacity_value;
            div_img.style.transform  = `scale(${1 - scale_value})`
            div_img.style.filter = `blur(${blur_value}px)`
            div_img.style.height = `${item_width}px`;
            div_img.style.width = `${item_width}px`;
            div_img.id = item.label + '_overlay'
            div_img.appendChild(svgElement)
            carouselItem.appendChild(div_img);
        }

        if(item.img_url){
            const div_img = document.createElement('div')
            div_img.style.backgroundColor = theme.primaryColor;
            div_img.style.opacity = opacity_value;
            div_img.style.height = `${item_width}px`;
            div_img.style.width = `${item_width}px`;
            const img = document.createElement('img');
            img.src = item.img_url; // Assuming that 'url' is where the image source is stored
            img.alt = item.label; // Provide a meaningful description in the alt text
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.objectPosition = 'center';
            div_img.appendChild(img)
            div_img.style.transform  = `scale(${1 - scale_value})`
            div_img.style.filter = `blur(${blur_value}px)`
            div_img.id = item.label + '_overlay'
            carouselItem.appendChild(div_img);
        }
        if(item.svg_path){
            img.innerHTML = svg_path
            // Append the overlay to the container
            // container.appendChild(overlay);
        }
        
        carouselInner.appendChild(carouselItem);
    });
    highlightCurrentItem(carouselItems[selectedItemIndex])
    scaleOtherItems(selectedItemIndex)
}

public_works = {
    "The Holy Bible": {
        "svg_path":'<svg viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-miterlimit:10;stroke-width:1.91px;}</style></defs><path class="cls-1" d="M20.59,18.68V22.5H5.32a1.91,1.91,0,0,1-1.91-1.91,1.92,1.92,0,0,1,1.91-1.91Z"></path><path class="cls-1" d="M20.59,1.5V18.68H5.32a1.92,1.92,0,0,0-1.91,1.91V3.41A1.92,1.92,0,0,1,5.32,1.5Z"></path><line class="cls-1" x1="7.23" y1="1.5" x2="7.23" y2="18.68"></line><line class="cls-1" x1="11.05" y1="9.14" x2="16.77" y2="9.14"></line><line class="cls-1" x1="13.91" y1="6.27" x2="13.91" y2="13.91"></line></g></svg>'
    },
    "The Dao De Jing":{
        "svg_path":'<svg fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 297 297" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M148.5,0C66.617,0,0,66.617,0,148.5S66.617,297,148.5,297c0.008,0,0.016,0,0.02,0c0.002,0,0.004,0,0.007,0 C230.397,296.984,297,230.374,297,148.5C297,66.617,230.383,0,148.5,0z M148.501,51.766c15.281,0,27.713,12.432,27.713,27.713 c0,15.281-12.432,27.713-27.713,27.713c-15.281,0-27.713-12.432-27.713-27.713C120.788,64.197,133.22,51.766,148.501,51.766z M148.5,276.084c-32.292,0-58.563-26.271-58.563-58.563c0-32.293,26.271-58.564,58.563-58.564c43.824,0,79.479-35.654,79.479-79.479 c0-13.588-3.434-26.386-9.469-37.583c34.654,22.834,57.575,62.09,57.575,106.604C276.085,218.851,218.851,276.084,148.5,276.084z"></path> <g> <path d="M148.5,241c-14.612,0-26.5-11.888-26.5-26.5s11.888-26.5,26.5-26.5c14.612,0,26.5,11.888,26.5,26.5S163.112,241,148.5,241z "></path> </g> </g></svg>'
    },
    "The Bhagavad Gita":{
        "svg_path":'<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--emojione-monotone" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill-rule="evenodd"> <path d="M57.244 29.604c-1.867-3.078-5.027-6.358-9.898-6.325c-6.857.046-9.533 5.497-11.82 10.063c-.713 1.422-1.854 3.618-3.461 3.93c-1.908.37-2.973-.726-4.229-1.246c2.625-2.122 4.979-4.6 5.383-8.53c.65-6.333-3.262-10.315-8.457-10.734c-5.027-.406-9.073.971-12.302 2.779c-.87.487-2.634 1.55-2.691 2.396c-.041.611 2.172 3.588 3.941 7.763c2.293-1.473 5.539-4.166 9.226-4.504c6.402-.587 6.908 5.634.576 6.805c-2.625.484-4.949-.195-7.112-.575c1.216 2.799-.63 8.066 1.538 9.968c2.037 1.787 4.892-.36 7.207-.287c3.369.106 5.744 3.811 4.133 7.477c-2.072 4.713-10.082 5.896-14.895 2.875c-9.199-5.774-7.544-16.678-9.227-16.678C2.935 34.779 1.898 62 21.686 62c7.92 0 14.586-5.953 13.936-14.377c-.189-2.451-1.123-4.625-1.73-6.518c1.629.176 3.229.034 4.709-.191c-2.031 3.484-.703 10.032 1.057 12.651c2.641 3.928 8.939 5.281 13.551 2.205c3.828-2.553 6.369-6.749 6.729-12.652c.328-5.43-.62-10.096-2.694-13.514M46.961 48.007c-4.555.483-7.445-1.905-7.783-7.188c3.814-1.569 5.074-8.202 9.705-10.927c4.008-2.358 6.271 2.432 6.535 5.847c.496 6.415-2.992 11.687-8.457 12.268" fill="#000000"> </path> <path d="M39.225 13.502s5.533-3.808 5.525-5.799C44.742 5.729 39.225 2 39.225 2S33.707 5.712 33.7 7.703c-.009 2.008 5.525 5.799 5.525 5.799" fill="#000000"> </path> <path d="M37.832 21.457c7.871 1.771 17.875-4.362 17.875-6.422c0-2.626-4.729-5.121-5.574-6.229c-2.537 3.265-7.109 7.418-12.975 5.846c-5.861-1.57-8.264-9.297-8.264-9.297c-.791 2.497-.781 5.519.096 7.859c1.315 3.508 5.092 7.399 8.842 8.243" fill="#000000"> </path> </g> </g></svg>'
    }
}
