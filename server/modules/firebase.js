/*Firebase Setup*/
const firebase = require("firebase-admin");
const serviceAccount = require("../smartcity_servicekey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://smartcity-auth-e09ae.firebaseio.com",
});
