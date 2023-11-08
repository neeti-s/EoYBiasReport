/* TO DO:
1. Append divs 
2. Three.js options
3. Form UI
4. */




// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getDatabase, ref, onValue, set, push, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//Import Firebase Authentication
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";


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
//Initialize Firebase Authentication
const auth = getAuth();
const provider = new GoogleAuthProvider();

const analytics = getAnalytics(app);
const replicateProxy = "https://replicate-api-proxy.glitch.me"

const db = getDatabase(app);
let userInDB; //create user folder
let projectInDB; //create project folder
let projectFolder;
let assumptionInDB; //create assumption folder in project folder
let questionInDB; //create question folder in project folder

const textDiv = document.getElementById("resulting_text");
const waitingDiv = document.getElementById("waiting_text");

init()

//User Authentication
let nameField = document.getElementById("nameField");
let username, emailid;

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

//Login Functions
const userSignIn = async() => {
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        // console.log(user);
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
}

const userSignOut = async() => {
    signOut(auth).then(() => {
        alert("You have signed out.")
    }).catch((error) => {})
}

onAuthStateChanged(auth, (user) => {
    if(user) {
        logoutButton.style.display = "block";
        loginButton.style.display = "none";
        username = user.displayName;
        emailid = user.email;
        loginMessage.textContent = `You have signed in as ${username} with the email address ${emailid}`
        loginMessage.style.display = "block";
        userInDB = ref(db, user.displayName);
        // console.log(userInDB)
    } else {
        logoutButton.style.display = "none";
        loginButton.style.display = "block";
        loginMessage.style.display = "none";
    }
});

//login
let loginButton = document.createElement("button");
loginButton.textContent = "Login with Google";
loginButton.style.backgroundColor = "white";
loginButton.style.color = "black"; 
loginButton.style.borderStyle = "solid"; 
loginButton.addEventListener('click', userSignIn);
//logout
let logoutButton = document.createElement("button");
logoutButton.textContent = "Logout";
logoutButton.style.backgroundColor = "white";
logoutButton.style.color = "black"; 
logoutButton.style.borderStyle = "solid"; 
logoutButton.addEventListener('click', userSignOut);

logoutButton.style.display = "none";

//Login message
let loginMessage = document.createElement("div");
loginMessage.style.display = "none";

// nameField.appendChild(nameFieldTxtBox);
nameField.appendChild(loginButton);
nameField.appendChild(logoutButton);
nameField.appendChild(loginMessage);


function init() {
    console.log("init");    
    let text_container = document.getElementById("text_container");
    let input_field = document.createElement("input");
    input_field.type = "text";
    input_field.id = "input_prompt";
    input_field.placeholder = "Enter an Assumption";
    input_field.size = 100;
        // Add buttons
        let submitButton = document.createElement("button");
        submitButton.textContent = "Generate Questions";
        submitButton.style.backgroundColor = "#1E1A26";
        submitButton.addEventListener("click", function () {
            askForWords(input_field.value);
            push(assumptionInDB, input_field.value); 
        });
    
        let clearButton = document.createElement("button");
        clearButton.textContent = "Clear";
        clearButton.style.backgroundColor = "#593128";
        clearButton.addEventListener("click", function () {
            input_field.value = "";
        });
    
        text_container.prepend(submitButton);
        text_container.prepend(clearButton);
        text_container.prepend(input_field);

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