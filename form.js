// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
// import { getDatabase, ref, onValue, set, push, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// //Import Firebase Authentication
// import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";


// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBZ7lKwOfHfLmaKJoR3lyIKGjPBpCm8_5k",
//   authDomain: "opinionated-shared-minds.firebaseapp.com",
//   databaseURL: "https://opinionated-shared-minds-default-rtdb.firebaseio.com",
//   projectId: "opinionated-shared-minds",
//   storageBucket: "opinionated-shared-minds.appspot.com",
//   messagingSenderId: "695121006555",
//   appId: "1:695121006555:web:def24557c0ffb9bed521fe",
//   measurementId: "G-88SJ1NTH56"
// };
 
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// //Initialize Firebase Authentication
// const auth = getAuth();
// const provider = new GoogleAuthProvider();

// const analytics = getAnalytics(app);
// const db = getDatabase(app);
// let userInDB; //create user folder

// //User Authentication
// let nameField = document.getElementById("nameField");
// let username, emailid;


// //Login Functions
// const userSignIn = async() => {
//     signInWithPopup(auth, provider)
//     .then((result) => {
//         const user = result.user;
//         // console.log(user);
//     }).catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//     })
// }

// const userSignOut = async() => {
//     signOut(auth).then(() => {
//         alert("You have signed out.")
//     }).catch((error) => {})
// }

// onAuthStateChanged(auth, (user) => {
//     if(user) {
//         logoutButton.style.display = "block";
//         loginButton.style.display = "none";
//         username = user.displayName;
//         emailid = user.email;
//         loginMessage.textContent = `You have signed in as ${username} with the email address ${emailid}`
//         loginMessage.style.display = "block";
//         userInDB = ref(db, user.displayName);
//         // console.log(userInDB)
//     } else {
//         logoutButton.style.display = "none";
//         loginButton.style.display = "block";
//         loginMessage.style.display = "none";
//     }
// });

// //login
// let loginButton = document.createElement("button");
// loginButton.textContent = "Login with Google";
// loginButton.style.backgroundColor = "white";
// loginButton.style.color = "black"; 
// loginButton.style.borderStyle = "solid"; 
// loginButton.addEventListener('click', userSignIn);
// //logout
// let logoutButton = document.createElement("button");
// logoutButton.textContent = "Logout";
// logoutButton.style.backgroundColor = "white";
// logoutButton.style.color = "black"; 
// logoutButton.style.borderStyle = "solid"; 
// logoutButton.addEventListener('click', userSignOut);

// logoutButton.style.display = "none";

// //Login message
// let loginMessage = document.createElement("div");
// loginMessage.style.display = "none";

// nameField.appendChild(loginButton);
// nameField.appendChild(logoutButton);
// nameField.appendChild(loginMessage);

// //define projectFolder as the title of the project so the address is correct

// // let assumptionInDB = ref(db, username + '/' + projectFolder + '/assumptions')
// // let questionInDB = ref(db, username + '/' + projectFolder + '/questions')
// assumptionInDB.on('value', (snapshot) => {
//   const data = snapshot.val();
//   // Do something with the data here
//   console.log(data);
// });
// questionInDB.on('value', (snapshot) => {
//     const data = snapshot.val();
//     // Do something with the data here
//     console.log(data);
//   });