import { initializeFirebase } from './firebaseAuth.js';
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { printAssumptionInDB } from "./sketch.js";

let dataBase;
let assumptionInDB;
let questionInDB;

fetch('firebaseConfig.json')
    .then(response => response.json())
    .then(data => {
        const firebaseData = initializeFirebase(data);
        const {
            db,
        } = firebaseData;
        dataBase = db;  
   })
   .catch(error => {
    console.error('Error loading Firebase configuration:', error);
});

const replicateProxy = "https://replicate-api-proxy.glitch.me"
const textDiv = document.getElementById("resulting_text");
const waitingDiv = document.getElementById("waiting_text");

//waiting for response from input field
async function askForWords(p_prompt, ParentDiv) {
    document.body.style.cursor = "progress";
    waitingDiv.innerHTML = "Questioning your Assumptions...";

    const isQuestion = p_prompt.endsWith('?');
    if (isQuestion) {
        console.log("question:", p_prompt);
        let newAssumption = await generateAssumptions(p_prompt);
        console.log("newAssumption", newAssumption[0]);
        await generateQuestions(newAssumption[0], ParentDiv);
    } else {
        console.log("assumption:", p_prompt);
        await generateQuestions(p_prompt, ParentDiv);
    }
}

async function generateAssumptions(p_prompt) {
    console.log("Entered generateAssumptions")
    let singleAssumption = [];
    // let multipleAssumptions = [];

    const prompt = await requestWordsFromReplicate(p_prompt+ "Limit the answer to 50 words.");
    singleAssumption.push(prompt.output.join(""))
    console.log("singleAssumption", singleAssumption);

    // const furtherPrompt = await requestWordsFromReplicate(singleAssumption + "Divide this into multiple sentences.");
    // multipleAssumptions.push(furtherPrompt.output.join(""))
    // console.log("multipleAssumptions", multipleAssumptions);

    waitingDiv.innerHTML = "A Question to Challenge your Assumptions:";
    // return multipleAssumptions;
    return singleAssumption;
}

async function generateQuestions(p_prompt, ParentDiv) {
    console.log("Entered generateQuestions");
    const sentences = p_prompt.match(/[^.!]+[.!]+/g);
    let questions = [];
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        sentences[i] = await requestWordsFromReplicate(sentence + " First rephrase. then convert this to a question. Limit to one sentence. Write in second person. Avoid first person words: I, me, my, mine, myself and instead ask the user the question.");
        questions.push(sentences[i].output.join(""));  
    }
    console.log("multipleQuestions", questions);

    for (let i = 0; i < questions.length; i++) {
        console.log("question:", questions[i]);
        createInputBoxWithQuestion(questions[i], ParentDiv);   // Create new input box and buttons
        questionInDB = ref(dataBase, 'questions')
        push(questionInDB, questions[i]);
    } 
    waitingDiv.innerHTML = "A Question to Challenge your Assumptions:";

    let input = p_prompt;
        if (input[input.length-1] === ".") {
            input = input.slice(0,-1);
            assumptionInDB = ref(dataBase, '/' + input)
        }

}

 function writeAssumption(question, answer) {
    set(push(assumptionInDB, 'user'),{
          question: question,
          answer: answer,
        });
      }

function createInputBoxWithQuestion(question, ParentDiv) {
    // Create a new div element to contain the textarea and buttons
    const containerDiv = document.createElement("div");
    containerDiv.id = question;
    // Create a new textarea element
    const headingElement = document.createElement("h3");
    headingElement.textContent = question; // Set the content of the question
    headingElement.style.fontSize = "1.5em";

    const textareaElement = document.createElement("textarea");
    textareaElement.value = ""; // Set the content of the textarea
    textareaElement.style.overflow = "auto"; // Make the textarea resizable
    textareaElement.style.width = "75ch"; // maximum width
    textareaElement.style.minHeight = "40px"; // minimum height

    // Create three buttons
    const button1 = document.createElement("button");
    button1.textContent = "Submit";
    button1.style.backgroundColor = "#1E1A26";
    button1.addEventListener('click', function(e) {
        let parentDiv = e.target.parentElement; // getting the parent element
        askForWords(textareaElement.value, parentDiv);
        console.log(headingElement.textContent);
        console.log(textareaElement.value);
        writeAssumption(headingElement.textContent, textareaElement.value);
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
    containerDiv.appendChild(headingElement);
    containerDiv.appendChild(textareaElement);
    containerDiv.appendChild(button1);
    // containerDiv.appendChild(button2);
    containerDiv.appendChild(button3);
    containerDiv.appendChild(lineBreak);
    containerDiv.appendChild(lineBreak);

    while (ParentDiv.firstChild) {
        ParentDiv.removeChild(ParentDiv.firstChild);
    }

    // Append the container to the Parent Div
    ParentDiv.appendChild(containerDiv); // Appending to the parent elements
    // ParentDiv.removeChild(ParentDiv.firstChild); // Removing the first child element
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

export { askForWords, generateAssumptions, generateQuestions, createInputBoxWithQuestion, requestWordsFromReplicate }
