<html>
    <body>
        <div class="container">
            <form id="embedCodeForm">
                <h1>Customize Your Soul Search Embed Code</h1>
                <label for="title">Title:</label>
                <input type="text" id="title" name="title"><br>
            
                <label for="subtitle">Subtitle:</label>
                <input type="text" id="subtitle" name="subtitle"><br>

                <label for="displayIcon">Display Icon:</label>
                <div id="displayIcon" class="radios">
                    <input type="radio" id="iconYes" name="displayIcon" value="true" checked>
                    <label for="iconYes">Yes</label>
                    <input type="radio" id="iconNo" name="displayIcon" value="false">
                    <label for="iconNo">No</label>
                </div>
            
                <label for="questions">Suggested questions (one per line):</label>
                <textarea id="questions" name="questions"></textarea><br>
            
                <div class="checkboxes-container">
                    <fieldset id="sources">
                        <legend>Sources to include:</legend>

                        <div class="checkbox-item">
                            <input type="checkbox" id="the_shift_network" name="sources" value="The Shift Network" checked>
                            <label for="The Shift Network">The Shift Network</label>
                        </div>

                        <div class="checkbox-item">
                            <input type="checkbox" id="adam_c_hall" name="sources" value="Adam C. Hall" checked>
                            <label for="Adam C. Hall">Adam C. Hall</label>
                        </div>

                        <!-- Add more sources as needed -->
                    </fieldset>
                </div>
                <br>
                <label for="gatedContent">Gate content?</label>
                <div id="gatedContent" class="radios">
                    <input type="radio" id="gatedContentYes" name="gatedContent" value="true" checked>
                    <label for="iconYes">Yes</label>
                    <input type="radio" id="gatedContentNo" name="gatedContent" value="false">
                    <label for="iconNo">No</label>
                </div>
            
                <label for="theme">Theme:</label>
                <div class="radios" id="theme">
                    <input type="radio" id="theme0" name="theme" value="0" checked>
                    <label for="theme0">A</label>
                    <input type="radio" id="theme1" name="theme" value="1">
                    <label for="theme1">B</label>
                    <input type="radio" id="theme2" name="theme" value="2">
                    <label for="theme2">C</label>
                    <input type="radio" id="theme3" name="theme" value="3">
                    <label for="theme3">D</label>
                </div>
            </form>
            <div class="output">
                <h3>Your Embed Code</h3>
                <p style="text-align: center;">Copy and paste this onto your web page to display your custom Soul Search widget.</p>
                <pre id="embedCodeOutput"></pre>
                <br>
                <p style="text-align: center;">This is how your embed code will look on your page. Note: this preview is not search-functional.</p>
                <div id="embedCodeDisplay">
                    <div id="soulsearch">
                        <link rel="stylesheet" href="./style.css">
                        <div class="widget-header centered-content">
                            
                    
                            <p id="soulsearch-title">Soul Search</p>
                            <img id="icon" src="https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Purple.png" height="80">
                            <p id="soulsearch-subtitle">Explore wisdom from ancient scriptures</p>
                        </div>
                        <div id="sample-questions" class="sample-questions"></div> <!-- Container for sample questions -->
                        <div class="widget-body">
                            <form id="search-form">
                                <div class="search-wrapper">
                                    <input type="text" id="search-input" placeholder="Enter your search here">
                                    <button type="submit">
                                        <img src="https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Black.svg" alt="Search" id="search-icon">
                                    </button>
                                </div>
                            </form>    
                            <div class="widget-footer">
                                <p id="soulsearch-subtext">Powered by <a href="https://soulguide.ai" target="_blank">Soul Search</a></p>
                            </div>    
                            <div id="search-results"></div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
        
    
    <script>
//SoulSearch Display Items



//Form Items
    document.addEventListener('DOMContentLoaded', function() {
    // Listen to changes on each form element and update the embed code accordingly
    const formElements = document.querySelectorAll('#embedCodeForm input, #embedCodeForm textarea, #embedCodeForm select');
    formElements.forEach(element => {
        element.addEventListener('change', updateEmbedCode);
        element.addEventListener('input', updateEmbedCode); // For textarea and typing in input
    });

    // Initial update to display embed code on page load with default values
    updateEmbedCode();
});

function encodeForHTMLAttribute(str) {
    return str
        .replace(/&/g, '&amp;') // First, replace & to avoid double encoding
        .replace(/"/g, '&quot;') // Encode double quotes
        .replace(/'/g, '&#39;')   // Encode single quotes (apostrophes)
        .replace(/</g, '&lt;')    // Encode less than
        .replace(/>/g, '&gt;');   // Encode greater than
}

function stringify_array(input_array){
    var stringNew = ''
    for (var i=0; i < input_array.length; i++){
        stringNew = stringNew + encodeForHTMLAttribute(input_array[i]) + '%^%'
    }
    stringNew = stringNew.substring(0, stringNew.length - 3)
    return stringNew
}

function updateEmbedCode() {
    const title = document.getElementById('title').value;
    document.getElementById('soulsearch-title').innerHTML = title

    const subtitle = document.getElementById('subtitle').value;
    document.getElementById('soulsearch-subtitle').innerHTML = subtitle


    const icon = document.querySelector('input[name="displayIcon"]:checked').value;
    if (icon == 'true') {
        document.getElementById('icon').style.display = "block";
    } else {
        document.getElementById('icon').style.display = "none";
    }

    const gated = document.querySelector('input[name="gatedContent"]:checked').value;

    var questions = document.getElementById('questions').value.split('\n').map(question => question.trim()).filter(Boolean);
    var questionsNew = stringify_array(questions)
    generateQuestionButtons(questions)

    // const sourceCheckboxes = document.querySelectorAll('#sources input[type="checkbox"]:checked');
    // const sources = Array.from(sourceCheckboxes).map(checkbox => checkbox.value);
    // var sourcesNew = stringify_array(sources)
    const sourceCheckboxes = document.querySelectorAll('#sources input[type="checkbox"]:checked')
    const sources = Array.from(sourceCheckboxes).map(checkbox => checkbox.value);
    var sourcesNew = stringify_array(sources)
    
    const themeIndex = document.querySelector('input[name="theme"]:checked').value;
    // const themeIndex = document.getElementById('theme').value;
    applyColorTheme(themeIndex)
    
    const embedCode = `<div id="soulsearch" title="${escapeHTML(title)}" subtitle="${escapeHTML(subtitle)}" 
    questions="${questionsNew}" icon=${icon}
    sources="${sourcesNew}" theme="${themeIndex}"
    gated="${gated}"></div>
    <script src="https://soulguide.github.io/soul-search/script2.js"><` + `/script>`;


    document.getElementById('embedCodeOutput').textContent = embedCode;
    // document.getElementById('embedCodeDisplay').innerHTML = embedCode.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");


}

function generateQuestionButtons(questions) {
    // let questions = JSON.parse(document.getElementById('soulsearch').getAttribute('questions'))
    const container = document.getElementById('sample-questions');
    container.innerHTML = ''
    questions.forEach(question => {
        const button = document.createElement('button');
        button.textContent = question;
        // Apply the "sample-question-button" class to each button
        button.className = 'sample-question-button';
        container.appendChild(button);
    });
}

function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const colorThemes = [
    {type: 'light', primaryColor: '#fbf8f0', secondaryColor: '#42234e', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Purple.svg"},
    {type: 'dark', primaryColor: '#42234e', secondaryColor: '#fbf8f0', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Orange.svg"},
    {type: 'light', primaryColor: '#FFFFFF', secondaryColor: '#444444', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Black.svg"},
    {type: 'dark', primaryColor: '#222222', secondaryColor: '#FFFFFF', icon_url:"https://irp.cdn-website.com/985193b3/dms3rep/multi/Soul+Search_Orange.svg"},

]

function applyColorTheme(themeIndex) {
    // let themeIndex = Number(document.getElementById('soulsearch').getAttribute('theme'))
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
    document.getElementById('icon').src = theme.icon_url;

    //Search Input
    const searchInput = document.getElementById('search-input'); // Reference to the input field
    searchInput.style.backgroundColor = theme.primaryColor; // Assuming your theme object includes this property
    searchInput.style.color = theme.secondaryColor; // Set input text color

    //Widget border
    const soulSearchWrapper = document.getElementById('soulsearch');
    soulSearchWrapper.borderColor = theme.secondaryColor

}

    
    </script>  
    <style>
        /* Style the form container */
#embedCodeForm {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.output {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Style the input fields and textarea */
#embedCodeForm input[type="text"],
#embedCodeForm textarea,
#embedCodeForm select {
    width: 100%;
    padding: 10px;
    margin-top: 8px;
    margin-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box; /* Ensures padding doesn't affect overall width */
}

/* Style the labels for better readability */
#embedCodeForm label {
    margin-top: 10px;
    margin-bottom: 5px;
    display: block; /* Makes the label take up the full width, moving the input below */
    color: #333;
    font-size: 18px;
}

/* Enhance the appearance of the select element */
#embedCodeForm select {
    cursor: pointer;
}

/* Style for multiple select to indicate it's selectable */
#embedCodeForm select[multiple] {
    height: auto; /* Adjust height based on the content */
}

/* Pre-tag styling for the output */
#embedCodeOutput {
    background-color: #eee;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    color: #333;
    font-family: monospace;
    white-space: pre-wrap; /* Ensures formatting is preserved */
    word-wrap: break-word; /* Ensures long lines don't overflow */
    max-height: 200px; /* Limit height and add scrollbar if needed */
    overflow-y: auto; /* Add vertical scrollbar if content is long */
    margin-top: 20px;
    width:400px;
    margin:auto;
}

h1{
    margin:20px;
    font-family:Arial, Helvetica, sans-serif;
    font-size: 28px;
    text-align: center;
}

h3{
    font-family:Arial, Helvetica, sans-serif;
    text-align: center;
}

.radios {
    display: flex; /* Activates Flexbox layout */
    align-items: center; /* Vertically centers the items if their heights are different */
    margin-top: 10px;
    margin-bottom: 10px;
}

.radios input[type="radio"] {
    margin-right: 5px;
    cursor: pointer;
}

.radios label {
    margin-right: 20px; /* Adjust the spacing between the yes/no options as needed */
    cursor: pointer;
}

/* Style the outer container */
.checkboxes-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
}

/* Style the fieldset to center its contents */
#sources {
    display: flex; /* Use Flexbox for the container */
    flex-wrap: wrap; /* Allow items to wrap to the next line if not enough space */
    justify-content: center; /* Center items horizontally */
    align-items: center; /* Align items vertically */
    gap: 20px; /* Space between individual items */
    margin-top: 20px;
    margin-bottom: 20px;
}

#sources div {
    display: flex; /* Use Flexbox for each item */
    align-items: center; /* Align checkbox and label vertically */
    cursor: pointer;
}

#sources label {
    margin-left: 5px; /* Space between checkbox and label */
}


/* Style individual checkbox items */
.checkbox-item {
    display: flex;
    flex-direction: row; /* Stack the checkbox above its label */
    align-items: center; /* Center-align the items */
    margin-bottom: 10px;
}

/* Optional: Adjust the gap between the checkbox and its label */
.checkbox-item input[type="checkbox"] {
    margin-bottom: 4px; /* Adjust as needed */
}

/* Style for the labels to bring them closer to the checkboxes */
.checkbox-item label {
    cursor: pointer;
}

.container {
    display: flex;
    flex-wrap: wrap; /* Ensures responsiveness */
    gap: 20px; /* Space between columns */
}

#embedCodeForm, .output {
    flex: 1; /* Each column takes up an equal amount of space */
    min-width: 300px; /* Minimum width for each column, adjust as needed */
}

/* Additional styles for the output to ensure readability */
#embedCodeOutput, #embedCodeDisplay {
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
}


    </style>  
</body>
    
</html>
