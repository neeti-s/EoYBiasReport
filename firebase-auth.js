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
