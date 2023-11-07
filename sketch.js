import { initializeFirebase } from './firebaseConfig.js';

fetch('firebaseConfig.json')
    .then(response => response.json())
    .then(data => {
        const firebaseData = initializeFirebase(data);
        // initializeFirebase(data);
        const {
                db,
            } = firebaseData;
            dataBase = db;
   })
   .catch(error => {
    console.error('Error loading Firebase configuration:', error);
});

const replicateProxy = "https://replicate-api-proxy.glitch.me"

let promptInDB;
let userInDB; //create user folder
let projectInDB; //create project folder
let projectFolder;
let assumptionInDB; //create assumption folder in project folder
let questionInDB; //create question folder in project folder

const textDiv = document.getElementById("resulting_text");
const waitingDiv = document.getElementById("waiting_text");


init()

//Project Name
let projectTitle = document.getElementById("projectTitle");
let projectTitleEntry = document.createElement("input");
projectTitleEntry.placeholder = "Enter a Project Name";
let projectTitleButton = document.createElement("button");
projectTitleButton.textContent = "Save";
projectTitleButton.style.backgroundColor = "white";
projectTitleButton.style.color = "black"; 
projectTitleButton.style.borderStyle = "solid"; 
projectTitle.appendChild(projectTitleEntry);
projectTitle.appendChild(projectTitleButton);
projectTitleButton.addEventListener('click', () => {
        projectFolder = projectTitleEntry.value
        // push(userInDB, projectTitleEntry.value);
        console.log(username);
        console.log(projectFolder)
        assumptionInDB = ref(db, username + '/' + projectFolder + '/assumptions')
        questionInDB = ref(db, username + '/' + projectFolder + '/questions')
        
});

//Preview Form
let formButton = document.createElement("button");
formButton.textContent = "Preview Form";
formButton.style.backgroundColor = "white";
formButton.style.color = "black"; 
formButton.style.borderStyle = "solid"; 
formButton.addEventListener('click', () => {
    window.open(`${location.href}/form.html`)
})
projectTitle.appendChild(formButton);


function init() {
    console.log("init");    
    let text_container = document.getElementById("text_container");
    let input_field = document.createElement("input");
    input_field.type = "text";
    input_field.id = "input_prompt";
    input_field.placeholder = "Enter an Assumption";
    input_field.style.width = "75ch";
    input_field.style.minHeight = "40px";
    input_field.style.display = "block";
    text_container.append(input_field);

    // Add buttons
    let submitButton = document.createElement("button");
    submitButton.textContent = "Generate Questions";
    submitButton.style.backgroundColor = "#1E1A26";
    submitButton.addEventListener("click", function () {
        askForWords(input_field.value);
        // push(promptInDB, input_field.value); 
        push(assumptionInDB, input_field.value); //choose what to push @neeti
    });

    let clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.style.backgroundColor = "#593128";
    clearButton.addEventListener("click", function () {
        input_field.value = "";
    });

    text_container.appendChild(submitButton);
    text_container.appendChild(clearButton);
    // input_field.addEventListener("keyup", function (event) {
    //     if (event.key === "Enter") {
    //         askForWords(input_field.value);
    //         push(promptInDB, input_field.value);
    //     }
    // });
}

//waiting for response from input field
async function askForWords(p_prompt) {
    document.body.style.cursor = "progress";
    waitingDiv.innerHTML = "Waiting for reply from Replicate...";

    const isQuestion = p_prompt.endsWith('?');
    if (isQuestion) {
        console.log("question:", p_prompt);
        let newAssumption = await generateAssumptions(p_prompt);
        console.log("newAssumption", newAssumption[0]);
        await generateQuestions(newAssumption[0]);
    } else {
        console.log("assumption:", p_prompt);
        await generateQuestions(p_prompt);
    }
}

async function generateAssumptions(p_prompt) {
    console.log("Entered generateAssumptions")
    let singleAssumption = [];
    let multipleAssumptions = [];

    const prompt = await requestWordsFromReplicate(p_prompt+ "Limit the answer to 50 words.");
    singleAssumption.push(prompt.output.join(""))
    console.log("singleAssumption", singleAssumption);

    const furtherPrompt = await requestWordsFromReplicate(singleAssumption + "Divide this into multiple sentences.");
    multipleAssumptions.push(furtherPrompt.output.join(""))
    console.log("multipleAssumptions", multipleAssumptions);

    // textDiv.innerHTML = multipleAssumptions;
    // waitingDiv.innerHTML = "Suggested Questions:";
    // changeToInputField();
    return multipleAssumptions;
}

async function generateQuestions(p_prompt) {
    console.log("Entered generateQuestions");
    const sentences = p_prompt.match(/[^.!]+[.!]+/g);
    let questions = [];
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        sentences[i] = await requestWordsFromReplicate(sentence + " Convert this to a question. Limit to one sentence.");
        questions.push(sentences[i].output.join(""));  
    }
    console.log("multipleQuestions", questions);

    for (let i = 0; i < questions.length; i++) {
        console.log("question:", questions[i]);
        // let words_response = questions[i];
        // textDiv.innerHTML = words_response;
        // waitingDiv.innerHTML = "Suggested Questions:";
        // changeToInputField();
        createInputBoxWithQuestion(questions[i]);
        // Create new input box and buttons
    } 
    waitingDiv.innerHTML = "Suggested Questions:";
    // return questions;
}

function createInputBoxWithQuestion(question) {
    // Create a new div element to contain the textarea and buttons
    const containerDiv = document.createElement("div");

    // Create a new textarea element
    const textareaElement = document.createElement("textarea");
    textareaElement.value = question; // Set the content of the textarea
    textareaElement.style.overflow = "auto"; // Make the textarea resizable
    textareaElement.style.width = "75ch"; // maximum width
    textareaElement.style.minHeight = "40px"; // minimum height

    // Create three buttons
    const button1 = document.createElement("button");
    button1.textContent = "Generate Questions";
    button1.style.backgroundColor = "#1E1A26";
    button1.addEventListener('click', function() {
        askForWords(textareaElement.value);
        //add questions below the question generating
    })

    const button2 = document.createElement("button");
    button2.textContent = "Save to Form";
    button2.style.backgroundColor = "#5D84A6";
    button2.addEventListener('click', function() {
        push(questionInDB, textareaElement.value);
        button2.textContent = "Saved";
        //how to delete from firebase?
    })

    const button3 = document.createElement("button");
    button3.textContent = "Delete";
    button3.style.backgroundColor = "#593128";
    button3.addEventListener('click', function() {
        containerDiv.remove();
    })

    // Create a line break element to put each textarea on a new line
    const lineBreak = document.createElement("br");

    // Append the textarea, buttons, and line break to the container
    containerDiv.appendChild(textareaElement);
    containerDiv.appendChild(button1);
    containerDiv.appendChild(button2);
    containerDiv.appendChild(button3);
    containerDiv.appendChild(lineBreak);
    containerDiv.appendChild(lineBreak);

    // Append the container to the textDiv
    textDiv.appendChild(containerDiv);
}



async function requestWordsFromReplicate(initialPrompt) {
    const data = {
        "version": "35042c9a33ac8fd5e29e27fb3197f33aa483f72c2ce3b0b9d201155c7fd2a287",
        input: {
            prompt: initialPrompt,
            max_tokens: 100,
            max_length: 100,
        },
    };
    // console.log("Asking for Words From Replicate via Proxy", data);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    };

    const url = replicateProxy + "/create_n_get/";
    // console.log("words url", url, "words options", options);

    const words_response = await fetch(url, options);
    // console.log("words_response", words_response);
    return await words_response.json();
}