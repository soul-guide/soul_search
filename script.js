var menuOnGlobal = 0;
let element = document.getElementById('soul_search');
let sources_visible = element.getAttribute('sources_visible');
let sources = element.getAttribute('sources');
let namespace = element.getAttribute('namespace');

window.onload = function() {
  loadHtml('https://soulguide.github.io/soul-search/index.html')
      .then(performSearch)
      .then(grabVars)
      .catch(error => console.error('Error in loadHtml or performSearch:', error));
};

function grabVars(){
  console.log(sources_visible)
  console.log(sources)
}
function loadHtml(url) {
  return new Promise((resolve, reject) => {
      fetch(url)
          .then(response => {
              if (response.ok) return response.text();
              throw new Error('Network response was not ok.');
          })
          .then(text => {
              document.getElementById('soul_search').innerHTML = text;
              resolve();
          })
          .catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
              reject(error);
          });
  });
}

document.addEventListener('DOMContentLoaded', function() {
    // Get all radio buttons with the name 'source'
    const radios = document.querySelectorAll('input[type=radio][name=source]');

    // Function to reset style and bold the selected label
    function updateLabelStyle() {
        // Reset styles for all labels
        radios.forEach(radio => {
            radio.parentNode.style.fontWeight = 'normal';
        });

        // Bold the label of the checked radio
        const checkedRadio = document.querySelector('input[type=radio][name=source]:checked');
        if (checkedRadio) {
            checkedRadio.parentNode.style.fontWeight = 'bold';
        }
      console.log(checkedRadio)
    }

    // Add change event listener to each radio button
    radios.forEach(radio => {
        radio.addEventListener('change', updateLabelStyle);
    });

    // Call updateLabelStyle initially in case a radio is checked by default
    updateLabelStyle();
    
});



function sendToSearch(query){
  if (!query){
    query =   document.getElementById('searchInput').value;
  }
  if (!query){
      return null
  }
   var queryEncoded = encodeURIComponent(query)
   var url = location.protocol + '//' + location.host + location.pathname
   //window.location.href = `https://soulguide.ai/testing-ground?q=${queryEncoded}`;
  //var sources = addSources();
  var sources = document.querySelector('input[name="source"]:checked').value;
  console.log(`raw sources: ${sources}`)
  var sourcesEncoded = encodeURIComponent(sources);
  var finalUrl = `${url}?q=${queryEncoded}&s=${sources}`;
  if (menuOnGlobal){
      finalUrl = finalUrl + `&m=y`
  }
   window.location.href = finalUrl
}

  // Function to perform search
function performSearch(query) {
  var url = new URL(window.location);
  var searchTerm = decodeURIComponent(url.searchParams.get("q"));
  if (!searchTerm){
    return null
  }
  var searchSources = decodeURIComponent(url.searchParams.get("s")).split(",");

  document.getElementById(searchSources).checked = true
  query = searchTerm;
  // Get the search term from the input field
  var searchTerm = document.getElementById('searchInput').value;

  if (query){
      searchTerm = query
      document.getElementById('searchInput').value = query;
  }
  var sources = searchSources

  // Make sure the search term is not empty
  if (searchTerm.trim() === '' && !query) {
    alert('Please enter a search term.');
    return;
  }
  if (!sources.length) {
    alert('Please choose at least one source text.');
    return;
  }
  document.getElementById("loader").style.display = "inline-block"
  document.getElementById("results").style.display = "none"

  var body = {
      query: searchTerm,
      sources: sources,
      numberResults: 1,
      display_sources: true,
      url : url,
      guide: true
    }
  if (namespace){
    body.namespace = namespace
  }
  // Perform the API call
  fetch(`https://eoubihciw9w5j6z.m.pipedream.net`,
  {
    method: "POST",
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      // Clear previous results
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '';
      // Check if data is empty
      if (data.length === 0) {
        resultsDiv.innerHTML = 'No results found.';
        return;
      }
      console.log(data)
      console.log(JSON.stringify(data))
      //var text = data.description.split('\n').join("</br>");
      var return_object = data.return_object.results[0]
      var source = return_object.source
      var reference = return_object.reference
      if (source == "A Course in Miracles"){
        reference = JSON.parse(reference).fip
      }
      var text = return_object.text
      var guide = data.return_object.guide.response
      // Loop through the data and display it
      //data.forEach(item => {
        const resultItem = document.createElement('div');
        /*resultItem.innerHTML = `
          <h2>${item.title}</h2>
          <p>${item.description}</p>
        `;*/
        var share_url = "https://soulguide.ai/signup"
        var share_message = encodeURIComponent(`${guide}
        
${share_url}`)
        var whatsApp_link = `https://wa.me/?text=${share_message}`
        resultItem.innerHTML = `<p class="guide">${guide}
        <br><i><a href="${whatsApp_link}">Share this message</a></i>
        </p>
        
        <b>${source}</b>
        <br><i>${reference}</i>
        <br>${text}
        <br>
        <br><input class="button" type="button" onclick="window.open('https://soulguide.ai/signup', '_blank');" value="Continue Your Conversation" />
`        ;
        resultsDiv.appendChild(resultItem);
      document.getElementById("results").style.display = "inline-block"
      document.getElementById("loader").style.display = "none"
      //});
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}



const showSettings = () => {
   document.getElementById("settings").classList.toggle('hidden');
   menuOnGlobal = (menuOnGlobal + 1) % 2
 }



 function addSources(sourceObject){
  var sourceObject = {
    ACIM: document.getElementById('ACIM').checked,
    Bible: document.getElementById('Bible').checked,
    Dao: document.getElementById('Dao').checked,
    Gita: document.getElementById('Gita').checked,
    source: document.getElementsByName('source')
    //holomovement: document.getElementById('holomovement').checked
  }
  var selectedValue = document.querySelector('input[name="source"]:checked').value;
  console.log("Here:" + selectedValue)
  console.log("debug: " + document.getElementsByName('source').value)
  var returnArray = new Array()
  for (const key in sourceObject) {
    if (sourceObject[key]){
      returnArray.push(key)
    }
  }
  console.log(returnArray)
  return returnArray
 }
