// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { initializeApp, getAuth, getDatabase, getAnalytics, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, ref } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';
// import { initializeApp, getAuth, getDatabase, getAnalytics, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getDatabase, ref, set, push, query, equalTo, orderByChild, onChildAdded, onChildChanged, onChildRemoved, onValue} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

let username, emailid, userInDB; 
let usernameCallback;

// Function to initialize Firebase using the loaded configuration
const initializeFirebase = (data) => {
    const app = initializeApp(data);
    const auth = getAuth(app);
    const db = getDatabase(app);
    const provider = new GoogleAuthProvider();
    const analytics = getAnalytics(app);


    const userSignIn = async () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            })
    }

    const userSignOut = async () => {
        signOut(auth).then(() => {
            alert("You have signed out.")
        }).catch((error) => {})
    }

    onAuthStateChanged(auth, (user) => {
        if(user) {
            logoutButton.style.display = "block";
            loginButton.style.display = "none";
            username = user.displayName;
            console.log(username)
            console.log(user.email);
            emailid = user.email;
            loginMessage.textContent = `You have signed in as ${username} with the email address ${emailid}`
            loginMessage.style.display = "block";
            userInDB = ref(db, user.displayName);

            if (usernameCallback) {
                usernameCallback(username);
            }
        } else {
            logoutButton.style.display = "none";
            loginButton.style.display = "block";
            loginMessage.style.display = "none";        }
    });
    
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

    nameField.appendChild(loginButton);
    nameField.appendChild(logoutButton);
    console.log(loginMessage.textContent);
    nameField.appendChild(loginMessage);

    return { app, auth, db, provider, analytics, userSignIn, userSignOut };

};

function printUsernamePath(callback) {
    if (typeof callback === 'function') {
        if (username) {
            callback(username);
        } else {
            usernameCallback = callback;
        }
    } else {
        console.error('Callback is not a function.');
    }
}


export { initializeFirebase, printUsernamePath };

