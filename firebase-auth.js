// firebase-auth.js

// Import the functions you need from the SDKs you need
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const appName = "gen-research";

function checkForUserInRegularDB(user) {
    // write a Firebase query to look for a UID in the database
    console.log("checkForUserInDB", user.uid);
    const db = getDatabase();
    const UIDRef = ref(db, `${appName}/users/${user.uid}/`);

    onValue(UIDRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            let data = snapshot.val();
            console.log("someone by that ID in DB", user.uid, data);
        } else {
            giveAuthUserRegularDBEntry(user);
        }
    });
}

function giveAuthUserRegularDBEntry(authUser) {
    let testUserTemplate = {
        email: "dan@example.com",
        displayName: "Test User",
        photoURL: "emptyProfile.png"
    };

    console.log("Auth user but no user info in DB yet", authUser, testUserTemplate);

    if (!authUser.displayName) authUser.displayName = authUser.email.split("@")[0];
    let displayName = authUser.displayName ?? testUserTemplate.displayName;
    let photoURL = authUser.photoURL ?? testUserTemplate.photoURL;

    if (!authUser.displayName) authUser.displayName = testUserTemplate.displayName;
    if (!authUser.photoURL) authUser.photoURL = testUserTemplate.photoURL;

    const db = getDatabase();
    set(ref(db, `${appName}/users/${authUser.uid}/`), {
        uid: authUser.uid,
        email: authUser.email,
        displayName: displayName,
        defaultProfileImage: photoURL,
        onlineStatus: "available",
    });
}

// Export the functions
export { checkForUserInRegularDB, giveAuthUserRegularDBEntry };

// /////AUTH STUFF
// //the ui for firebase authentication doesn't use the modular syntax
// let authUser

// let uiConfig;
// let loggedIn = false;

// let localUserEmail = "no email";

// uiConfig = {
//     callbacks: {
//         signInSuccessWithAuthResult: function (authResult, redirectUrl) {
//             authUser = authResult;
//             console.log("succesfuly logged in", authResult.user.email);
//             if (loggedIn) location.reload(); //reboot if this is a change.
//             // User successfully signed in.
//             // Return type determines whether we continue the redirect automatically
//             // or whether we leave that to developer to handle.
//             return false;
//         },
//         uiShown: function () {
//             // The widget is rendered.
//             // Hide the loader.
//             document.getElementById('loader').style.display = 'none';
//         }
//     },
//     // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//     signInFlow: 'popup',
//     // signInSuccessUrl: '<url-to-redirect-to-on-success>',
//     signInOptions: [
//         firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//         firebase.auth.EmailAuthProvider.PROVIDER_ID
//     ],
//     tosUrl: '<your-tos-url>',
//     privacyPolicyUrl: '<your-privacy-policy-url>'
// };

// function connectToFirebaseAuth() {
//     firebase.initializeApp(firebaseConfig);
//     //this allowed seperate tabs to have seperate logins
//     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
//     firebase.auth().onAuthStateChanged((firebaseAuthUser) => {
//         console.log("my goodness there has been an auth change");
//         document.getElementById("signOut").display = "block";
//         if (!firebaseAuthUser) {
//             document.getElementById("name").display = "none";
//             document.getElementById("profile-image").display = "none";
//             document.getElementById("signOut").style.display = "none";
//             console.log("no valid login, sign in again?");
//             var ui = new firebaseui.auth.AuthUI(firebase.auth());
//             ui.start('#firebaseui-auth-container', uiConfig);

//         } else {
//             console.log("we have a user", firebaseAuthUser);
//             authUser = firebaseAuthUser

//             document.getElementById("signOut").style.display = "block";
//             localUserEmail = authUser.multiFactor.user.email;
//             myDBID = authUser.multiFactor.user.uid;
//             console.log("authUser", authUser, "myDBID", myDBID);
//             document.getElementById("name").innerHTML = authUser.multiFactor.user.displayName;
//             if (authUser.multiFactor.user.photoURL != null)
//                 document.getElementById("profile-image").src = authUser.multiFactor.user.photoURL;
//             checkForUserInRegularDB(authUser.multiFactor.user);
//             subscribeToUsers()
//         }
//     });
// }


// //// ALL THE UI AUTH STUFF IS DONE IN THE OLD WEB PAGE NAME SPACE STYLE, NOT MODULAR
// document.getElementById("signOut").addEventListener("click", function () {
//     firebase.auth().signOut().then(function () {
//         console.log("User signed out");
//         location.reload();
//     }).catch(function (error) {
//         console.log("Error:", error);
//     });
// });


// function checkForUserInRegularDB(user) {
//     //write a firebase query to do look for a uid in the database
//     console.log("checkForUserInDB", user.uid);
//     db = getDatabase();
//     let UIDRef = ref(db, appName + '/users/' + user.uid + "/");

//     onValue(UIDRef, (snapshot) => {
//         if (snapshot.exists()) {
//             console.log(snapshot.val());
//             let data = snapshot.val();

//             console.log("someone by that id in db", myDBID, data);
//         } else {
//             giveAuthUserRegularDBEntry(authUser);
//         }
//     });

// }


// function giveAuthUserRegularDBEntry(authUser) {
//     let testUserTemplate = {
//         email: "dan@example.com",
//         displayName: "Test User",
//         photoURL: "emptyProfile.png"
//     };
//     console.log("Authuser but no user info in DB yet", authUser, testUserTemplate);
//     if (!authUser.displayName) authUser.displayName = authUser.email.split("@")[0];
//     let displayName = authUser.displayName ?? testUserTemplate.displayName;
//     let photoURL = authUser.photoURL ?? testUserTemplate.photoURL;
//     if (!authUser.displayName) authUser.displayName = testUserTemplate.displayName;
//     if (!authUser.photoURL) authUser.photoURL = testUserTemplate.photoURL;

//     const db = getDatabase();
//     set(ref(db, appName + '/users/' + authUser.uid + "/"), {
//         'uid': authUser.uid,
//         'email': authUser.email,
//         'displayName': displayName,
//         'defaultProfileImage': photoURL,
//         'onlineStatus': "available",
//     });

// }
