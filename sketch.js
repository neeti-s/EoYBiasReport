// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getDatabase, ref, onValue, set, push, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZ7lKwOfHfLmaKJoR3lyIKGjPBpCm8_5k",
  authDomain: "opinionated-shared-minds.firebaseapp.com",
  databaseURL: "https://opinionated-shared-minds-default-rtdb.firebaseio.com",
  projectId: "opinionated-shared-minds",
  storageBucket: "opinionated-shared-minds.appspot.com",
  messagingSenderId: "695121006555",
  appId: "1:695121006555:web:def24557c0ffb9bed521fe",
  measurementId: "G-88SJ1NTH56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const replicateProxy = "https://replicate-api-proxy.glitch.me"

const db = getDatabase(app);
const promptInDB = ref(db, "prompts");

init()

function init() {
    console.log("init");

    let nameField = document.getElementById("nameField");
    let nameFieldTxtBox = document.createElement("input");
    nameFieldTxtBox.type = "text";
    nameFieldTxtBox.id = "inputName";
    nameFieldTxtBox.placeholder = "Enter a username";
    nameFieldTxtBox.size = 30;
    nameField.appendChild(nameFieldTxtBox);
    
    let text_container = document.getElementById("text_container");
    let input_field = document.createElement("input");
    input_field.type = "text";
    input_field.id = "input_prompt";
    input_field.placeholder = "Enter an Assumption";
    input_field.size = 75;
    text_container.prepend(input_field);
    input_field.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            askForWords(input_field.value);
            push(promptInDB, input_field.value);
        }
    });
}

function changeToInputField() {
    const textDiv = document.getElementById("resulting_text");
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = "resulting_input";
    inputField.value = textDiv.innerText;
    inputField.size = 75;
    inputField.style.overflow = "auto";
    
    textDiv.innerHTML = ''; 
    textDiv.appendChild(inputField); 
}

//waiting for response from input field
async function askForWords(p_prompt) {
    document.body.style.cursor = "progress";
    const textDiv = document.getElementById("resulting_text");
    const waitingDiv = document.getElementById("waiting_text");
    waitingDiv.innerHTML = "Waiting for reply from Replicate...";

    let words_response;

    const isQuestion = p_prompt.endsWith('?');
    if (isQuestion) {
        console.log("question:", p_prompt);
        words_response = await generateAssumptions(p_prompt);

        textDiv.innerHTML = words_response;
        waitingDiv.innerHTML = "Suggested Questions:";
        changeToInputField();
    } else {
        console.log("assumption:", p_prompt);
        const questions = await generateQuestions(p_prompt);
        console.log(questions);

        for (let i = 0; i < questions.length; i++) {
            console.log("question:", questions[i]);
            let words_response = questions[i];
            textDiv.innerHTML = words_response;
            waitingDiv.innerHTML = "Suggested Questions:";
            changeToInputField();
            // Create new input box and buttons
        } 
    }
}

async function generateAssumptions(p_prompt) {
    console.log("Entered generateAssumptions")
    const singleAssumption = [];
    const multipleAssumptions = [];

    const prompt = await requestWordsFromReplicate(p_prompt+ "Limit the answer to 50 words.");
    singleAssumption.push(prompt.output.join(""))
    console.log("singleAssuption", singleAssumption);

    const furtherPrompt = await requestWordsFromReplicate(singleAssumption + "Divide this into multiple sentences.");
    multipleAssumptions.push(furtherPrompt.output.join(""))
    console.log("multipleAssumptions", multipleAssumptions);
    return multipleAssumptions;
}

async function generateQuestions(p_prompt) {
    console.log("Entered generateQuestions");
    const sentences = p_prompt.match(/[^.!]+[.!]+/g);
    const questions = [];
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        sentences[i] = await requestWordsFromReplicate(sentence + " Convert this to a question. Limit to one sentence.");
        questions.push(sentences[i].output.join(""));  
    }
    console.log("multipleQuestions", questions);
    return questions;
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