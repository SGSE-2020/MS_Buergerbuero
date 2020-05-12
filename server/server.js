/*Firebase Initialization*/
const firebase = require("firebase-admin");
const serviceAccount = require("./smartcity_servicekey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://smart-city-ss2020.firebaseio.com"
});

/*Start all components*/
require('./components/rest_server')(firebase);
require('./components/grpc_server')(firebase);



