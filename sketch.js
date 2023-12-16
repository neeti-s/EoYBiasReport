import { initializeFirebase, printUsernamePath } from './firebaseAuth.js';
import { askForWords, generateAssumptions, generateQuestions, createInputBoxWithQuestion, requestWordsFromReplicate } from './QuestionsAssumptions.js';
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

//  

let projectFolder;
let assumptionInDB; //create assumption folder in project folder
let questionInDB; //create question folder in project folder
// const textDiv = document.getElementById("resulting_text");
// const waitingDiv = document.getElementById("waiting_text");


// //Project Name
// let projectTitle = document.getElementById("projectTitle");
// let projectTitleEntry = document.createElement("input");
// projectTitleEntry.placeholder = "Enter a Project Name";
// let projectTitleButton = document.createElement("button");
// projectTitleButton.textContent = "Save";
// projectTitleButton.style.backgroundColor = "white";
// projectTitleButton.style.color = "black"; 
// projectTitleButton.style.borderStyle = "solid"; 
// projectTitle.appendChild(projectTitleEntry);
// projectTitle.appendChild(projectTitleButton);
// projectTitleButton.addEventListener('click', () => {
//         projectFolder = projectTitleEntry.value
//         console.log(projectFolder)
//         console.log(username);
//         assumptionInDB = ref(dataBase, username + '/' + projectFolder + '/assumptions')
//         questionInDB = ref(dataBase, username + '/' + projectFolder + '/questions')
//         let usernameDB = ref(dataBase, username);
//         console.log(usernameDB);
//         onValue(usernameDB, (snapshot) => {
//             const data = snapshot.val(); 
//             console.log(data)
//           });
// });

//Preview Form
// let formButton = document.createElement("button");
// formButton.textContent = "Preview Form";
// formButton.style.backgroundColor = "white";
// formButton.style.color = "black"; 
// formButton.style.borderStyle = "solid"; 
// formButton.addEventListener('click', () => {
//     window.open(`${location.href}/form.html`)
// })
// projectTitle.appendChild(formButton);

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
        assumptionInDB = ref(dataBase, 'assumptions')
        push(assumptionInDB, input_field.value); 
    });

    // let clearButton = document.createElement("button");
    // clearButton.textContent = "Clear";
    // clearButton.style.backgroundColor = "#593128";
    // clearButton.addEventListener("click", function () {
    //     input_field.value = "";
    // });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.backgroundColor = "#593128";
    deleteButton.addEventListener('click', function(e) {
        e.target.parentElement.remove(); 
        //how to delete new assumption?
    })

    // let addButton = document.createElement("button");
    // addButton.textContent = "Add Assumption";
    // addButton.style.backgroundColor = "#1E1A26";
    // addButton.addEventListener("click", function () {
    //     init();
    //     text_container.append(deleteButton);
    // });

    
    assumptionDiv.append(input_field);
    assumptionDiv.append(submitButton);
    assumptionDiv.append(deleteButton);
    text_container.append(assumptionDiv);
    // text_container.append(clearButton);
    // text_container.append(addButton);

    // input_field.addEventListener("keyup", function (event) {
    //     if (event.key === "Enter") {
    //         askForWords(input_field.value);
    //         push(promptInDB, input_field.value);
    //     }
    // });
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