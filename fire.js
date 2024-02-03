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

// Get a reference to the database service
var database = firebase.database();
var dataPath = 'ucsc-event-planner/rooms';
function addNewData() {
    var newDataValue = document.getElementById("newDataInput").value;
    var newID = document.getElementById("newIDInput").value;

    // Replace 'yourDataPath' with the path in your database where you want to store the data
    var dataPath = 'ucsc-event-planner/rooms/' + newID;

    // Set the new item to the specified path with the desired ID
    database.ref(dataPath).set({
        value: newDataValue
    });

    console.log("New data added to the 'locations' key with ID:", newID, "Value:", newDataValue);
    readEverything();
}
var dataDictionary = {};

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