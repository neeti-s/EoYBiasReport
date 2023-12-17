import { initializeFirebase } from './firebaseAuth.js';
import { askForWords, generateAssumptions, generateQuestions, createInputBoxWithQuestion, requestWordsFromReplicate } from './QuestionsAssumptions.js';
import { ref, push, onValue, child, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

let dataBase;

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

let projectFolder;
let assumptionInDB; //create assumption folder in project folder
let questionInDB; //create question folder in project folder

init()
const addButton = document.getElementById("addButton"); // Get the button element
addButton.addEventListener("click", init); // Add click event listener to the button


function init() {
    console.log("init");    
    let text_container = document.getElementById("text_container");

    const assumptionDiv = document.createElement("div");
    let input_field = document.createElement("input");
    input_field.type = "text";
    input_field.id = "input_prompt";
    input_field.placeholder = "Enter an Assumption";
    input_field.size = 100;
    
    // Add buttons
    let submitButton = document.createElement("button");
    submitButton.textContent = "Generate Questions";
    submitButton.style.backgroundColor = "#1E1A26";
    submitButton.addEventListener("click", function (e) {
        askForWords(input_field.value, e.target.parentElement); //attach to the parent element
        //push(assumptionInDB, input_field.value); 
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.backgroundColor = "#593128";
    deleteButton.addEventListener('click', function(e) {
        e.target.parentElement.remove(); 
        //how to delete new assumption?
    })
    
    assumptionDiv.append(input_field);
    assumptionDiv.append(submitButton);
    assumptionDiv.append(deleteButton);
    text_container.append(assumptionDiv);
}

function printAssumptionInDB() {
    return assumptionInDB;
}

export { printAssumptionInDB }

function printQuestionInDB() {
    return questionInDB;
}


export { printQuestionInDB }

function printProjectFolderPath() {
    return projectFolder;
}

export { printProjectFolderPath }