/* ************************************************************************ */
/*
    2017 (c) Jim Motyl


        Create a 'config' variable with the specifics for our database.
*/
// fill in with the info found in - 
//      Firebase Console->Project->Settings->Add Firebase to your web app 
var config = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
};

/*
        Create a variable to reference the database
*/
var gDatabase     = firebase.initializeApp(config).database();
// For this project these are the paths used. You can change
// these as needed for your application.
var gSensorData   = gDatabase.ref().child('sensorlog/data');
var gSensorStatus = gDatabase.ref().child('sensorlog/status');
