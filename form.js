import { getDatabase, ref, set, push, query, equalTo, orderByChild, onChildAdded, onChildChanged, onChildRemoved, onValue} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { initializeFirebase, printUsernamePath } from './firebaseAuth.js';
import { printProjectFolderPath } from './sketch.js';

let dataBase;

fetch('firebaseConfig.json')
    .then(response => response.json())
    .then(data => {
        const firebaseData = initializeFirebase(data);
        // initializeFirebase(data);
        const {
                db,
            } = firebaseData;
            dataBase = db;
   })
   .catch(error => {
    console.error('Error loading Firebase configuration:', error);
});

let assumptionDiv = document.createElement('div'); 
let DialogueDiv = dialogueGuideField

function addAssumptionField(key, data) {
    let assumptionField = document.getElementById(key);
    if(assumptionField) {
        assumptionField.innerHTML = data.text;
    } else {
        let div = document.createElement('div');
        div.id = key; //syncing the id with the key in the database
        div.style.overflow = "auto";
        div.style.resize = "both";
        div.style.font = "medium - moz - fixed";
        div.style.border = "2px solid gray";
        div.setAttribute("contenteditable", true);
        div.style.width = "90%";
        div.style.height = "100px";
        div.innerHTML = data.username + ": " + data.text;
        div.addEventListener('blur', function (event) {  //blur is when you click away from the textfield
            let content = event.target.innerHTML.split(":")[1].trim();
            console.log("blur", content);
            set(ref(db, username + '/' + projectFolder + '/assumptions' + key), {

                "text": content,
            });
        });
        textContainerDiv.append(div);
    }
}

const username = printUsernamePath();
const projectFolder = printProjectFolderPath();
function assumptionsToForm() {
    const assumptionRef = ref(db, username + '/' + projectFolder + '/assumptions')
    onChildAdded(assumptionRef, (data) => {
        console.log("added", data.key, data.val());
        addAssumptionField(data.key, data.val());
    })
}