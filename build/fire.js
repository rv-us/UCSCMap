// Your Firebase project configuration
var firebaseConfig = {
    apiKey: "AIzaSyDiEfJb9DOKfqXfy_Y9xZhQmZ0TXbNO1ro",
    authDomain: "ucsc-event-planner-408319.firebaseapp.com",
    databaseURL: "https://ucsc-event-planner-408319-default-rtdb.firebaseio.com",
    projectId: "ucsc-event-planner-408319",
    storageBucket: "ucsc-event-planner-408319.appspot.com",
    messagingSenderId: "648866811",
    appId: "1:648866811:web:5ed56e5e1de181b184f95e",
    measurementId: "G-XSLP60WBV9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var firestore = firebase.firestore();
// Get a reference to the database service
var database = firebase.database();
var dataPath = 'ucsc-event-planner';
var menuPath = 'scrapedMenus'
function addNewData() {
    var newDataValue = document.getElementById("newDataInput").value;
    var newID = document.getElementById("newIDInput").value;

    // Replace 'yourDataPath' with the path in your database where you want to store the data
    var dataPath = 'ucsc-event-planner' + newID;

    // Set the new item to the specified path with the desired ID
    database.ref(dataPath).set({
        value: newDataValue
    });

    console.log("New data added to the 'locations' key with ID:", newID, "Value:", newDataValue);
    readEverything();
}
let dataDictionary = {};
let menuDictionary = {};
function readMenu() {
    // Replace 'yourDataPath' with the path in your database where you want to read the data

    database.ref(menuPath).on('value', function(snapshot) {
        // Clear the existing data in the dictionary
        menuDictionary = {};
        
        // Iterate through each child in the snapshot and update the dictionary
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var value = childSnapshot.val();
            console.log(key);
            console.log(value);
            menuDictionary[key] = value;
        });

        console.log("Menu Dictionary:", menuDictionary);
    });
}
// Function to read everything from the database and update the dictionary
function readEverything() {
    // Replace 'yourDataPath' with the path in your database where you want to read the data

    database.ref(dataPath).on('value', function(snapshot) {
        // Clear the existing data in the dictionary
        dataDictionary = {};
        
        // Iterate through each child in the snapshot and update the dictionary
        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var value = childSnapshot.val();
            console.log(key);
            console.log(value);
            dataDictionary[key] = value;
        });

        console.log("Data Dictionary:", dataDictionary);
    });
}
function loginUser() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            // User signed in successfully
            var user = userCredential.user;
            console.log("User signed in:", user.uid);
        })
        .catch(function(error) {
            // Handle errors during sign-in
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Login error:", errorCode, errorMessage);
        });
}
function signUpUser() {
    var email = document.getElementById("signupEmail").value;
    var password = document.getElementById("signupPassword").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            // User signed up successfully
            var user = userCredential.user;
            console.log("User signed up:", user.uid);
        })
        .catch(function(error) {
            // Handle errors during sign-up
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Sign-up error:", errorCode, errorMessage);
        });
}
function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
        .then(function (result) {
            // This gives you a Google Access Token.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log("User signed in with Google:", user);
            handleAuthClick();
            readEverything();
        })
        .catch(function (error) {
            // Handle errors during Google sign-in
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Google Sign-in error:", errorCode, errorMessage);
        });
        tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
        throw (resp);
    }
    listUpcomingEvents();
    console.log("test");
    };
}
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in, and you can access the UID
      var uid = user.uid;
      console.log("User UID:", uid);
    } else {
      // User is signed out
      console.log("User is signed out");
    }
  });
  readMenu();