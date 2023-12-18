import { initializeFirebase } from './firebaseAuth.js';
import { ref, push, set, query, limitToLast, orderByChild, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { printAssumptionInDB } from "./sketch.js";

let dataBase;
let lastAssumption;
let lastQuestion;
let assumptionInDB;
let questionInDB;

const waitingDiv = document.getElementById("current_question");
const replicateProxy = "https://replicate-api-proxy.glitch.me"

fetch('firebaseConfig.json')
    .then(response => response.json())
    .then(data => {
        const firebaseData = initializeFirebase(data);
        const {
            db,
        } = firebaseData;
        dataBase = db;  
        getLastSavedAssumption(lastQuestion => {
            if (lastQuestion !== null) {
                waitingDiv.innerHTML = lastQuestion;
                console.log(lastQuestion);
            } else {
                waitingDiv.innerHTML = "Write a new assumption";
            }
        });
   })
   .catch(error => {
    console.error('Error loading Firebase configuration:', error);
});

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

    // waitingDiv.innerHTML = "A Question to Challenge your Assumptions:";
    // return multipleAssumptions;
    return singleAssumption;
}

async function generateQuestions(p_prompt, ParentDiv) {
    console.log("Entered generateQuestions");
    const sentences = p_prompt.match(/[^.!]+[.!]+/g);
    let questions = [];
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        sentences[i] = await requestWordsFromReplicate(sentence + ". Convert this to a question. Limit to one sentence of max 20 words. Write in second person. Avoid first person words: I, me, my, mine, myself and instead ask the user the question.");
        // First rephrase. then
        questions.push(sentences[i].output.join(""));  
    }
    console.log("multipleQuestions", questions);

    for (let i = 0; i < questions.length; i++) {
        console.log("question:", questions[i]);
        createInputBoxWithQuestion(questions[i], ParentDiv);   // Create new input box and buttons
        const timestamp = Date.now();
        questionInDB = ref(dataBase, 'questions');
        const newQuestionRef = push(questionInDB); // Create a new reference using push
        set(newQuestionRef, {
            question: questions[i],
            timestamp: timestamp
        });
    } 
    // waitingDiv.innerHTML = "A Question to Challenge your Assumptions:";

    let input = p_prompt;
        if (input[input.length-1] === ".") {
            input = input.slice(0,-1);
            assumptionInDB = ref(dataBase, '/' + input)
        }

}

 function writeAssumption(question, answer) {
    set(push(assumptionInDB),{
          question: question,
          answer: answer,
        });
      }

function getLastSavedAssumption(callback) {
    const lastRef = ref(dataBase, 'questions');
    
    // Order the data by timestamp and limit to the last 1
    const orderedRef = query(lastRef, orderByChild('timestamp'), limitToLast(1));
     onValue(orderedRef, snapshot => {
        const lastSavedNode = snapshot.val();
            if (lastSavedNode) {
                lastQuestion = lastSavedNode[Object.keys(lastSavedNode)[0]].question;
                console.log(lastQuestion);
                callback(lastQuestion);
            } else {
                callback(null);
            }
        }, {
        onlyOnce: true // This ensures the listener is triggered only once
    });
}

function createInputBoxWithQuestion(question, ParentDiv) {
    // update div elements to new question textarea
    let headingElement = document.getElementById("current_question");
    getLastSavedAssumption(lastQuestion => {
        if (lastQuestion !== null) {
            headingElement.innerHTML = lastQuestion;
            console.log(lastQuestion);
        } else {
            waitingDiv.innerHTML = "Write a new assumption";
        }
    });
    // console.log(getElementById("question").innerHTML);
    // let printElement = document.getElementById("question");
    // printElement.innerHTML = question;

    const textareaElement = document.getElementById("input_field");

    // submit answer to new question
    const submitButton = document.getElementById("submit_button");
    submitButton.addEventListener('click', function(e) {
        let parentDiv = e.target.parentElement; // getting the parent element
        askForWords(textareaElement.value, parentDiv);
        console.log(headingElement.textContent);
        console.log(textareaElement.value);
        writeAssumption(question, textareaElement.value);
    })
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
