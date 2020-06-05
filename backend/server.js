/*Global*/
const config = require('./components/config');

/*Firebase Initialization*/
const firebase = require("firebase-admin");
const serviceAccount = require("./smartcity_servicekey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://smart-city-ss2020.firebaseio.com"
});

/*Start all components*/


console.log("Initial start up Bürgerbüro Server!");
console.log("-----------------------------------");

/*Routes*/
let channel = require('./components/messages');
require('./components/rest_server')(config, firebase, channel);
require('./components/grpc_server')(config, firebase);


let db = require('./components/database');

db.sequelize.sync().then(function(){
    console.log('DB connection sucessful.');
}, function(err){
    // catch error here
    console.log('DB connection not sucessful.');
});




