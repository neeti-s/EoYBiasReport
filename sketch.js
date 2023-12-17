import { initializeFirebase, printUsernamePath } from './firebaseAuth.js';
import { askForWords, generateAssumptions, generateQuestions, createInputBoxWithQuestion, requestWordsFromReplicate } from './QuestionsAssumptions.js';
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

//  

let projectFolder;
let assumptionInDB; //create assumption folder in project folder
let questionInDB; //create question folder in project folder
let mainassumptioncounter = true;

init();

function init() {
    console.log("init");    
    
    let assumption_field = document.getElementById("mainAnQ");
    let input_field = document.getElementById("input_field");
    
    let submitButton = document.getElementById("submit_button")
    submitButton.addEventListener("click", function (e) {
        // const mainAnQ = document.getElementById("mainAnQ");
        if (mainassumptioncounter == true) {
            assumption_field.innerHTML =  input_field.value;
            mainassumptioncounter = false;
        }
        askForWords(input_field.value, e.target.parentElement); //attach to the parent element
        assumptionInDB = ref(dataBase, 'assumptions')
        push(assumptionInDB, input_field.value); 
    });

    const deleteButton = document.getElementById("delete_button");
    deleteButton.addEventListener('click', function(e) {
        e.target.parentElement.remove(); 
        //how to delete new assumption?
    })

    const addButton = document.getElementById("assumption_button");
    // addButton.addEventListener("click", init); // Add click event listener to the button
    addButton.addEventListener("click", function(e) {
        mainassumptioncounter = true;
        document.getElementById("current_question").innerHTML = "Write a new assumption";
    })
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