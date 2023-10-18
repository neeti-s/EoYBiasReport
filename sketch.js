//To Do:
//Namefield submit and disappears - replace the text with name?
//Space between
//Submit button for assumption, regenerate button
//Generated Questions in input field
//



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
    const buttons = '<button onclick="handleButton1()">Button 1</button>' +
        '<button onclick="handleButton2()">Button 2</button>' +
        '<button onclick="handleButton3()">Button 3</button>';
    textDiv.innerHTML = ''; 
    textDiv.appendChild(inputField); 
    textDiv.appendChild(buttons); 

}

//buttons
function handleButton1() {
    console.log("Button 1 clicked");
}

function handleButton2() {
    console.log("Button 2 clicked");
}

function handleButton3() {
    console.log("Button 3 clicked");
}

//waiting for response from input field
async function askForWords(p_prompt) {

    document.body.style.cursor = "progress";
    const textDiv = document.getElementById("resulting_text");
    const waitingDiv = document.getElementById("waiting_text");
    waitingDiv.innerHTML = "Waiting for reply from Replicate...";

    // Check if the prompt is a question.
    const isQuestion = p_prompt.endsWith('?');

    // Define the initial prompt based on whether it's a question or not.
    let initialPrompt = isQuestion
        ? p_prompt + "Limit the answer to 50 words."
        : p_prompt + "Convert this to a question. Limit to one sentence.";

    const data = {
        "version": "35042c9a33ac8fd5e29e27fb3197f33aa483f72c2ce3b0b9d201155c7fd2a287",
        input: {
            // prompt: p_prompt + "Convert this to a question. Limit to one sentence.",
            // prompt: p_prompt + "Limit the answer to 50 words.",
            prompt: initialPrompt, // Updated the prompt here
            max_tokens: 100,
            max_length: 100,
        },
    };
    console.log("Asking for Words From Replicate via Proxy", data);
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    };
    const url = replicateProxy + "/create_n_get/"
    console.log("words url", url, "words options", options);
    const words_response = await fetch(url, options);
    console.log("words_response", words_response);
    const proxy_said = await words_response.json();
    if (proxy_said.output.length == 0) {
        textDiv.innerHTML = "Something went wrong, try it again";
    } else {
        textDiv.innerHTML = proxy_said.output.join("");
        waitingDiv.innerHTML = "Suggested Questions:";
        changeToInputField();
        console.log("proxy_said", proxy_said.output.join(""));
    }
}