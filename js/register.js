const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBDflw7dOC8qkOYZXDZBVARqvQQLoqkUbQ",
    authDomain: "fiction-6bc9e.firebaseapp.com",
    projectId: "fiction-6bc9e",
    storageBucket: "fiction-6bc9e.appspot.com",
    messagingSenderId: "343399124890",
    appId: "1:343399124890:web:72f69d351e6b1af358b423",
    measurementId: "G-TVE2PW8EJH"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredentials) => {
            sessionStorage.setItem("uid", userCredentials.user.uid)
            window.location.href = "./index.html"
        })
        .catch((error) => {
            console.error("Failed: " + error.message);
        })
}

function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
            db.collection("users").doc(userCredentials.user.uid).set({
                email: email,
                fname: fname,
                lname: lname,
                userId: userCredentials.user.uid
            })
            .then(function () {
                window.location.href = "./index.html";
            })
    })

    .catch((err) => {
        alert(err.message)
        console.log(err.code);
        console.log(err.message);
    });
}

// Add event listeners for Enter key press
document.getElementById("login-email").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        login();
    }
});

document.getElementById("login-password").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        login();
    }
});

document.getElementById("email").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        signUp();
    }
});

document.getElementById("password").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        signUp();
    }
});

document.getElementById("fname").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        signUp();
    }
});

document.getElementById("lname").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        signUp();
    }
});
