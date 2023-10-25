//To Do:
//Auth - replace with name printed
//Submit button for assumption
//What are the other buttons? Regenerate, push to firebase, delete
//Generated Questions in input field
//question generates question
//Better UI
//push to form

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

let db;
let words_response; 
let textContainerDiv;
let name;
let div;
let userLoggedIn = false;

document.getElementById("loginButton").addEventListener("click", function() {
    let username = document.getElementById("usernameInput").value;
    console.log('login button clicked!')
    if (username.trim() === '') {
        alert("Please enter a username.");
    } else if (username) {
        let loginForm = document.getElementById("loginForm");
        let usernameDisplay = document.createElement("div");
        usernameDisplay.textContent = username;
        loginForm.appendChild(usernameDisplay);
        userLoggedIn = true;
    }
})

init()

function init() {
    console.log("init");
    db = getDatabase(app);
    
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
            addToDBList('generated/users', input_field.value);
        }
    });

    textContainerDiv = document.createElement('div');
    document.body.append(textContainerDiv);
    document.body.append(input_field);

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
        // changeToInputField();
        subscribeToPosts()
        console.log("proxy_said", proxy_said.output.join(""));
    }
}

function subscribeToPosts() {

    const commentsRef = ref(db, 'generated/users');
    onChildAdded(commentsRef, (data) => {
        console.log("added", data.key, data.val());
        changeToInputField(data.key, data.val());
    });

    onChildChanged(commentsRef, (data) => {

        const element = document.getElementById(data.key);
        element.innerHTML = data.val().text;
        console.log("changed", data.key, data.val(), element);
    });

    onChildRemoved(commentsRef, (data) => {
        console.log("removed", data.key, data.val());
    });

}


function changeToInputField(key, data) {
    let textDiv = document.getElementById(key);
    if (textDiv) {
        textDiv.innerHTML = data.text;
    } else {
        let inputField = document.createElement("input");
        inputField.id = key;
        inputField.style.overflow = "auto";
        inputField.style.resize = "both";
        inputField.setAttribute("contenteditable", true);
        inputField.style.width = "90%";
        inputField.style.height = "100px";
        inputField.innerHTML = data.text;
        inputField.type = "text";
        // div.addEventListener('blur', function (event) {  
        //     let content = event.target.innerHTML.split(":")[1].trim();
        //     console.log("blur", content);
        //     set(ref(db, 'generated/users/' + key), {
        //         "username": name,
        //         "prompt": content,
        //     });
        // });
        textContainerDiv.appendChild(inputField); 

        let button1 = document.createElement("button");
        button1.textContent = "Button 1";
        button1.addEventListener("click", handleButton1);
        textContainerDiv.appendChild(button1);

        let button2 = document.createElement("button");
        button2.textContent = "Button 2";
        button2.addEventListener("click", handleButton2);
        textContainerDiv.appendChild(button2);

        let button3 = document.createElement("button");
        button3.textContent = "Button 3";
        button3.addEventListener("click", handleButton3);
        textContainerDiv.appendChild(button3);

    }
}

// function changeToInputField() {
//     const textDiv = document.getElementById("resulting_text");
//     const inputField = document.createElement("input");
//     inputField.type = "text";
//     inputField.id = "resulting_input";
//     inputField.value = textDiv.innerText;
//     textDiv.innerHTML = ''; 
//     textDiv.appendChild(inputField); 

// }

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

function writeUserData(userId, name, email, imageUrl) {
    const db = getDatabase();
    set(ref(db, 'generated/users/' + userId), {
        username: name,
        email: email,
    });
}

function askForExistingUser(name) {
    const db = getDatabase();
    const usersRef = ref(db, 'generated/users/' + name);
    console.log("usersRef", usersRef);
    onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            console.log("new user");
            const db = getDatabase();
            set(ref(db, 'generated/users/' + name), {
                username: name
            });
        }
        console.log("from database", data);
    });
}

function addToDBList(address, newText) {
    // Create a new post reference with an auto-generated id
    const db = getDatabase();
    const postListRef = ref(db, address);
    const newPostRef = push(postListRef);
    set(newPostRef, {
        username: newText,
        timestamp: Date.now(),
        // text: newText
    });

};