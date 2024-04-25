
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
        document.getElementById("ss-nav").style.display = "flex";
        addCarouselItems()
        // Attach this function to your arrow buttons
        document.getElementById('ss-next').addEventListener('click', function(event) {
            event.preventDefault();
            moveCarousel(1)
        }); 
        document.getElementById('ss-prev').addEventListener('click', function(event) {
            event.preventDefault();
            moveCarousel(-1)
        }); 
    }
}

function decodeForHTMLAttribute(str, json=false) {
    str = str
        .replace(/&amp;/g, '&') // First, replace & to avoid double encoding
        .replace(/&&&/g, '"') // Encode double quotes
        .replace(/&#39;/g, "'")   // Encode single quotes (apostrophes)
        .replace(/&lt;/g, '<')    // Encode less than
        .replace(/&gt;/g, '>')   // Encode greater than
        .replace(/@@@/g, '{')
        .replace(/###/g, '}')
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

    if (result.steward == 'Public'){
        cta = 'https://www.soulguide.ai/signup'
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
    let themeIndex = Number(document.getElementById('soulsearch').getAttribute('theme'))
    const theme = colorThemes[themeIndex];
    var title_label = `<h2 id="ss-title">${result.title}</h2>`
    
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
    const resultsHeader = document.getElementById('results-header'); // Reference to the input field
    if (resultsHeader){
        resultsHeader.style.color = theme.secondaryColor; // Set input text color
    }

    const result_title = document.getElementById('ss-title'); // Reference to the input field
    if (result_title){
        result_title.style.color = theme.secondaryColor; // Set input text color
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
        "svg_path":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 899.89 1019.18"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-miterlimit:333.33;stroke-width:63.67px;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M738.07,860V987.35h-509a63.67,63.67,0,1,1,0-127.34Z"/><path class="cls-1" d="M738.07,287.35V860h-509a64,64,0,0,0-63.67,63.67V351a64,64,0,0,1,63.67-63.66Z"/><line class="cls-1" x1="292.74" y1="287.35" x2="292.74" y2="860.01"/><line class="cls-1" x1="420.07" y1="542.01" x2="610.74" y2="542.01"/><line class="cls-1" x1="515.4" y1="446.35" x2="515.4" y2="701.01"/><path d="M19.14,7.92V70H90.87v-62h19.37v148.3H90.87V86.69H19.14v69.53H0V7.92Z"/><path d="M239.17,102.09c0,39.39-27.28,56.55-53,56.55-28.82,0-51-21.12-51-54.78,0-35.65,23.33-56.55,52.81-56.55C218.49,47.31,239.17,69.53,239.17,102.09Zm-84.49,1.11c0,23.32,13.42,40.92,32.34,40.92,18.48,0,32.35-17.38,32.35-41.37,0-18-9-40.92-31.91-40.92S154.68,83,154.68,103.2Z"/><path d="M263.59,0H283V156.22H263.59Z"/><path d="M322.55,49.73l23.33,62.93c2.42,7,5.06,15.4,6.82,21.78h.44c2-6.38,4.18-14.52,6.82-22.22l21.12-62.49h20.47L372.5,125.64c-13.86,36.52-23.32,55.23-36.52,66.67-9.47,8.36-18.93,11.66-23.77,12.54l-4.84-16.28a51.21,51.21,0,0,0,16.94-9.46,58.65,58.65,0,0,0,16.29-21.57,13.9,13.9,0,0,0,1.54-4.62,16.88,16.88,0,0,0-1.32-5.06L301.43,49.73Z"/><path d="M466.45,9.9c8.36-1.76,21.56-3.08,35-3.08,19.15,0,31.47,3.3,40.71,10.78,7.7,5.72,12.32,14.52,12.32,26.19,0,14.3-9.46,26.84-25.08,32.56v.44C543.46,80.31,560,92,560,114a40,40,0,0,1-12.54,29.7c-10.34,9.46-27.06,13.86-51.27,13.86a223.75,223.75,0,0,1-29.7-1.76Zm19.14,60.73H503c20.25,0,32.13-10.56,32.13-24.86,0-17.39-13.2-24.21-32.57-24.21-8.8,0-13.86.66-16.94,1.32Zm0,71.07a102.27,102.27,0,0,0,16.06.88c19.81,0,38.07-7.26,38.07-28.82,0-20.25-17.38-28.61-38.29-28.61H485.59Z"/><path d="M606.6,19.8c.22,6.6-4.62,11.88-12.32,11.88A11.51,11.51,0,0,1,582.62,19.8a11.8,11.8,0,0,1,12.1-12.1C602,7.7,606.6,13,606.6,19.8ZM585,156.22V49.73H604.4V156.22Z"/><path d="M635.65,156.22c.44-7.26.88-18,.88-27.5V0h19.14V66.89h.44c6.82-11.88,19.14-19.58,36.3-19.58,26.41,0,45.11,22,44.89,54.34,0,38.07-24,57-47.75,57-15.4,0-27.72-5.94-35.64-20h-.66l-.88,17.6Zm20-42.68a36.25,36.25,0,0,0,.88,7c3.74,13.42,15,22.66,29,22.66,20.25,0,32.35-16.5,32.35-40.93,0-21.34-11-39.6-31.69-39.6-13.2,0-25.52,9-29.48,23.76a38.15,38.15,0,0,0-1.1,7.92Z"/><path d="M761.72,0h19.36V156.22H761.72Z"/><path d="M824.42,106.5c.44,26.18,17.17,37,36.53,37,13.86,0,22.22-2.42,29.48-5.5l3.3,13.86c-6.82,3.08-18.48,6.6-35.42,6.6-32.79,0-52.37-21.56-52.37-53.68s18.92-57.43,49.95-57.43c34.76,0,44,30.58,44,50.16a71.27,71.27,0,0,1-.66,9Zm56.77-13.87c.22-12.32-5.06-31.46-26.84-31.46-19.58,0-28.17,18-29.71,31.46Z"/></g></g></svg>'
    },
    "The Dao De Jing":{
        "svg_path":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 861.25 951.13"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M430,151.13c-220.56,0-400,179.44-400,400s179.44,400,400,400h.08c220.52,0,399.92-179.46,399.92-400S650.56,151.13,430,151.13Zm0,139.44a74.65,74.65,0,1,1-74.65,74.65A74.73,74.73,0,0,1,430,290.57Zm0,604.22c-87,0-157.74-70.76-157.74-157.74S343,579.3,430,579.3c118,0,214.09-96,214.09-214.08A212.73,212.73,0,0,0,618.58,264c93.35,61.51,155.09,167.25,155.09,287.15C773.67,740.63,619.5,894.79,430,894.79Z"/><path d="M430,800.29a71.38,71.38,0,1,1,71.38-71.38A71.46,71.46,0,0,1,430,800.29Z"/><path d="M0,2.48A220.1,220.1,0,0,1,32.75,0C54.88,0,70.64,5.13,81.08,14.87,91.7,24.61,97.9,38.42,97.9,57.71c0,19.48-6,35.41-17.17,46.38C69.57,115.25,51.16,121.27,28,121.27a247.42,247.42,0,0,1-28-1.42ZM15.4,108a97,97,0,0,0,15.58.89c32.93,0,50.81-18.42,50.81-50.64.18-28.14-15.76-46-48.33-46a87.07,87.07,0,0,0-18.06,1.6Z"/><path d="M164.81,120.21l-1.23-10.8H163c-4.78,6.72-14,12.74-26.2,12.74-17.35,0-26.2-12.21-26.2-24.61,0-20.71,18.41-32,51.52-31.86V63.91c0-7.08-1.95-19.83-19.47-19.83a42.74,42.74,0,0,0-22.31,6.37l-3.54-10.26c7.08-4.61,17.35-7.62,28.15-7.62,26.2,0,32.57,17.88,32.57,35.06v32A120,120,0,0,0,179,120.21Zm-2.3-43.73c-17-.36-36.29,2.65-36.29,19.29,0,10.1,6.73,14.88,14.7,14.88a21.33,21.33,0,0,0,20.71-14.34,16.36,16.36,0,0,0,.88-5Z"/><path d="M280.24,76.66c0,31.68-21.95,45.49-42.67,45.49-23.19,0-41.07-17-41.07-44.08,0-28.68,18.77-45.5,42.49-45.5C263.6,32.57,280.24,50.45,280.24,76.66Zm-68,.88c0,18.77,10.8,32.93,26,32.93,14.87,0,26-14,26-33.28,0-14.52-7.26-32.93-25.67-32.93S212.26,61.25,212.26,77.54Z"/><path d="M338,2.48A220.1,220.1,0,0,1,370.7,0C392.83,0,408.58,5.13,419,14.87c10.62,9.74,16.82,23.55,16.82,42.84,0,19.48-6,35.41-17.17,46.38-11.16,11.16-29.57,17.18-52.76,17.18a247.29,247.29,0,0,1-28-1.42ZM353.35,108a97,97,0,0,0,15.58.89c32.93,0,50.81-18.42,50.81-50.64.18-28.14-15.76-46-48.33-46a87.07,87.07,0,0,0-18.06,1.6Z"/><path d="M464.7,80.2c.36,21.06,13.81,29.74,29.39,29.74,11.15,0,17.88-2,23.72-4.43l2.66,11.15C515,119.14,505.6,122,492,122c-26.37,0-42.13-17.35-42.13-43.2S465.06,32.57,490,32.57c28,0,35.4,24.61,35.4,40.37a58.47,58.47,0,0,1-.53,7.26ZM510.38,69c.17-9.91-4.08-25.31-21.6-25.31-15.76,0-22.66,14.51-23.9,25.31Z"/><path d="M607.21.88h15.4V80.73c0,31.69-15.58,41.42-36.11,41.42A50,50,0,0,1,570,119.32l2.3-12.57a36.75,36.75,0,0,0,12.93,2.3c13.81,0,22-6.19,22-29.56Z"/><path d="M665.1,10.45c.18,5.31-3.72,9.55-9.92,9.55a9.26,9.26,0,0,1-9.38-9.55A9.49,9.49,0,0,1,655.54.71C661.38.71,665.1,5,665.1,10.45ZM647.75,120.21V34.52h15.58v85.69Z"/><path d="M689.17,57.71c0-8.85-.17-16.11-.71-23.19h13.81l.89,14.16h.35c4.25-8.14,14.17-16.11,28.33-16.11,11.86,0,30.27,7.09,30.27,36.47v51.17H746.53V70.81c0-13.81-5.13-25.31-19.83-25.31-10.26,0-18.23,7.26-20.89,15.93a22.63,22.63,0,0,0-1.06,7.26v51.52H689.17Z"/><path d="M861.25,34.52c-.36,6.2-.71,13.1-.71,23.55v49.74c0,19.65-3.9,31.69-12.22,39.13-8.32,7.79-20.35,10.27-31.15,10.27-10.27,0-21.6-2.48-28.51-7.09l3.9-11.86A48.32,48.32,0,0,0,817.7,145c15.93,0,27.61-8.32,27.61-29.92v-9.56H845c-4.78,8-14,14.34-27.26,14.34-21.25,0-36.47-18.06-36.47-41.78,0-29,18.94-45.5,38.59-45.5,14.87,0,23,7.79,26.73,14.87h.36l.71-12.92ZM845.14,68.33a22.16,22.16,0,0,0-.89-7.08c-2.83-9-10.44-16.46-21.77-16.46-14.87,0-25.49,12.57-25.49,32.4C797,94,805.48,108,822.3,108c9.56,0,18.24-6,21.6-15.93a27.3,27.3,0,0,0,1.24-8.32Z"/></g></g></svg>'
    },
    "The Bhagavad Gita":{
        "svg_path":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1045.01 868.48"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g id="SVGRepo_iconCarrier" data-name="SVGRepo iconCarrier"><path d="M767.92,487.35c-22.35-36.46-58.81-75.28-116.45-74.1-81.17,0-111.75,64.69-138.8,118.8-8.24,16.47-22.35,42.35-41.18,45.88-22.35,4.7-35.28-8.23-49.4-14.12,30.58-24.7,58.81-54.11,63.52-100,8.23-74.11-38.82-121.16-100-125.87-58.81-4.7-107,11.77-144.68,32.94-10.59,5.88-30.59,17.64-31.76,28.23,0,7.06,25.88,42.35,45.87,91.75,27.06-17.64,64.7-49.4,108.22-52.93,75.29-7.06,81.17,65.87,7.06,80-30.58,5.88-57.64-2.35-83.52-7.06,14.12,32.94-7.05,95.28,17.65,117.63,23.53,21.17,57.64-4.7,84.69-3.53,40,1.18,67.05,44.7,48.23,88.22-24.7,55.29-118.81,69.41-175.27,34.12-108.22-68.23-88.22-196.45-108.22-196.45-24.7-2.35-36.46,317.61,196.44,317.61,92.93,0,171.75-70.58,163.51-169.39-2.35-29.41-12.94-54.11-20-76.46,18.83,2.35,37.65,0,55.29-2.35-23.53,41.17-8.23,117.63,12.94,149.39,30.58,45.87,104.69,62.34,160,25.88,44.7-30.59,75.28-78.82,78.81-149.4,3.53-63.52-8.23-118.8-32.94-158.8m-120,216.44c-54.11,5.89-87.05-22.35-91.75-84.69,44.7-18.82,60-96.46,114.1-128.22,47.05-28.23,74.11,28.23,76.46,68.23,5.88,76.46-35.29,137.63-98.81,144.68"/><path d="M556.19,298s64.7-44.7,64.7-68.23-64.7-67.05-64.7-67.05-64.7,43.53-64.7,67.05S556.19,298,556.19,298"/><path d="M539.72,392.07c92.93,21.18,210.56-51.75,210.56-75.28,0-30.58-55.29-60-65.87-72.93-29.41,38.82-83.52,87.05-152.92,68.22s-97.64-109.39-97.64-109.39c-9.41,29.41-9.41,64.69,1.18,92.93,16.47,40,61.17,85.87,104.69,96.45"/></g><path d="M0,8A149,149,0,0,1,28.15,5.49c15.4,0,25.31,2.65,32.75,8.67,6.2,4.61,9.91,11.69,9.91,21.07,0,11.51-7.61,21.6-20.18,26.2v.35C62,64.62,75.24,74,75.24,91.7a32.15,32.15,0,0,1-10.09,23.9c-8.32,7.61-21.78,11.16-41.25,11.16A179.57,179.57,0,0,1,0,125.34ZM15.4,56.83h14c16.28,0,25.84-8.5,25.84-20,0-14-10.62-19.47-26.2-19.47A66.2,66.2,0,0,0,15.4,18.41Zm0,57.18a82.47,82.47,0,0,0,12.93.71c15.93,0,30.62-5.84,30.62-23.19,0-16.29-14-23-30.8-23H15.4Z"/><path d="M95.42,0H111V53.46h.35a29,29,0,0,1,11.15-11,32.07,32.07,0,0,1,15.94-4.43c11.5,0,29.92,7.08,29.92,36.65v51H152.78V76.48C152.78,62.67,147.64,51,133,51c-10.09,0-18.06,7.08-20.89,15.57A18.81,18.81,0,0,0,111,74v51.69H95.42Z"/><path d="M241.12,125.69l-1.24-10.8h-.53c-4.78,6.73-14,12.75-26.21,12.75-17.34,0-26.2-12.21-26.2-24.61,0-20.71,18.41-32,51.52-31.86V69.4c0-7.08-2-19.83-19.47-19.83a42.74,42.74,0,0,0-22.31,6.37l-3.54-10.27c7.08-4.6,17.35-7.61,28.15-7.61,26.2,0,32.57,17.88,32.57,35.05v32.05a120.8,120.8,0,0,0,1.42,20.53ZM238.81,82c-17-.36-36.29,2.65-36.29,19.29,0,10.09,6.73,14.87,14.7,14.87a21.32,21.32,0,0,0,20.71-14.34,16.24,16.24,0,0,0,.88-5Z"/><path d="M352.82,40c-.35,6.2-.71,13.1-.71,23.54V113.3c0,19.65-3.89,31.69-12.21,39.12-8.32,7.79-20.36,10.27-31.16,10.27-10.27,0-21.6-2.48-28.5-7.08l3.89-11.86a48.35,48.35,0,0,0,25.14,6.73c15.94,0,27.62-8.32,27.62-29.92V111h-.35c-4.78,8-14,14.34-27.27,14.34-21.24,0-36.47-18.06-36.47-41.78,0-29,18.95-45.5,38.6-45.5,14.87,0,23,7.79,26.73,14.87h.35L339.19,40ZM336.71,73.82a22.17,22.17,0,0,0-.88-7.08c-2.84-9-10.45-16.46-21.78-16.46-14.87,0-25.49,12.57-25.49,32.39,0,16.82,8.5,30.81,25.32,30.81,9.55,0,18.23-6,21.59-15.94a26.91,26.91,0,0,0,1.24-8.32Z"/><path d="M425.4,125.69l-1.24-10.8h-.53c-4.78,6.73-14,12.75-26.2,12.75-17.35,0-26.2-12.21-26.2-24.61,0-20.71,18.41-32,51.52-31.86V69.4c0-7.08-1.95-19.83-19.48-19.83A42.73,42.73,0,0,0,381,55.94l-3.54-10.27c7.08-4.6,17.35-7.61,28.15-7.61,26.2,0,32.57,17.88,32.57,35.05v32.05a119.78,119.78,0,0,0,1.42,20.53ZM423.1,82c-17-.36-36.29,2.65-36.29,19.29,0,10.09,6.73,14.87,14.69,14.87a21.32,21.32,0,0,0,20.72-14.34,16.24,16.24,0,0,0,.88-5Z"/><path d="M467.89,40l16.82,48.15a221,221,0,0,1,6.9,22h.53c1.95-7.08,4.43-14.16,7.26-22L516,40h16.29l-33.64,85.68H483.82L451.25,40Z"/><path d="M593.76,125.69l-1.24-10.8H592c-4.78,6.73-14,12.75-26.2,12.75-17.35,0-26.2-12.21-26.2-24.61,0-20.71,18.41-32,51.51-31.86V69.4c0-7.08-1.94-19.83-19.47-19.83a42.74,42.74,0,0,0-22.31,6.37l-3.54-10.27c7.09-4.6,17.35-7.61,28.15-7.61,26.2,0,32.58,17.88,32.58,35.05v32.05a120.87,120.87,0,0,0,1.41,20.53ZM591.46,82c-17-.36-36.29,2.65-36.29,19.29,0,10.09,6.72,14.87,14.69,14.87a21.32,21.32,0,0,0,20.71-14.34,16.26,16.26,0,0,0,.89-5Z"/><path d="M705.64,0V103.56c0,7.62.18,16.29.71,22.13h-14l-.71-14.87h-.36c-4.78,9.56-15.22,16.82-29.21,16.82-20.71,0-36.64-17.53-36.64-43.55-.18-28.5,17.52-46,38.41-46,13.1,0,22,6.2,25.85,13.1h.35V0ZM690.06,74.88a27.6,27.6,0,0,0-.7-6.55,22.91,22.91,0,0,0-22.49-18c-16.11,0-25.67,14.16-25.67,33.1,0,17.35,8.5,31.69,25.32,31.69,10.44,0,20-6.9,22.84-18.59a27.08,27.08,0,0,0,.7-6.72Z"/><path d="M860.37,120.38a111.18,111.18,0,0,1-36.65,6.55c-18.06,0-32.93-4.6-44.61-15.75-10.27-9.92-16.64-25.85-16.64-44.44.18-35.58,24.61-61.61,64.62-61.61,13.8,0,24.6,3,29.74,5.49l-3.72,12.57c-6.37-2.83-14.34-5.13-26.38-5.13-29,0-48,18.06-48,48,0,30.28,18.23,48.16,46,48.16,10.09,0,17-1.42,20.54-3.19V75.42H821.07V63h39.3Z"/><path d="M900.73,15.93c.18,5.31-3.72,9.56-9.91,9.56a9.27,9.27,0,0,1-9.39-9.56,9.5,9.5,0,0,1,9.74-9.73C897,6.2,900.73,10.45,900.73,15.93ZM883.38,125.69V40H899v85.68Z"/><path d="M943.57,15.4V40h22.31V51.87H943.57V98.08c0,10.62,3,16.64,11.68,16.64a34.64,34.64,0,0,0,9-1.06l.71,11.68c-3,1.24-7.79,2.12-13.81,2.12-7.26,0-13.1-2.3-16.82-6.55-4.42-4.6-6-12.21-6-22.3V51.87H915.07V40h13.28V19.47Z"/><path d="M1030.85,125.69l-1.24-10.8h-.53c-4.78,6.73-14,12.75-26.21,12.75-17.34,0-26.2-12.21-26.2-24.61,0-20.71,18.42-32,51.52-31.86V69.4c0-7.08-2-19.83-19.47-19.83a42.74,42.74,0,0,0-22.31,6.37l-3.54-10.27c7.08-4.6,17.35-7.61,28.15-7.61,26.2,0,32.57,17.88,32.57,35.05v32.05a120.8,120.8,0,0,0,1.42,20.53ZM1028.54,82c-17-.36-36.29,2.65-36.29,19.29,0,10.09,6.73,14.87,14.7,14.87a21.32,21.32,0,0,0,20.71-14.34,16.24,16.24,0,0,0,.88-5Z"/></g></g></svg>'
    }
}
