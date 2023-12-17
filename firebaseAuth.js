// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { initializeApp, getAuth, getDatabase, getAnalytics, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, ref } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';
// import { initializeApp, getAuth, getDatabase, getAnalytics, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getDatabase, ref, set, push, query, equalTo, orderByChild, onChildAdded, onChildChanged, onChildRemoved, onValue} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

// Function to initialize Firebase using the loaded configuration
const initializeFirebase = (data) => {
    const app = initializeApp(data);
    const auth = getAuth(app);
    const db = getDatabase(app);
    const provider = new GoogleAuthProvider();
    const analytics = getAnalytics(app);

    return { app, auth, db, provider, analytics };

};

export { initializeFirebase };

