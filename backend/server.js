/*Global*/
const config = require('./components/config');

/*Firebase Initialization*/
const firebase = require("firebase-admin");
const fbClient = require("firebase");
const serviceAccount = require("./smartcity_servicekey.json");
const fs = require('fs');
const util = require('util');
const path = require('path');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://smart-city-ss2020.firebaseio.com",

});

fbClient.initializeApp({
    apiKey: 'AIzaSyBvTg0_QrhEvQ9UeZPH8--E2JZ55KA_u_c',
        authDomain: 'smart-city-ss2020.firebaseapp.com',
        databaseURL: 'https://smart-city-ss2020.firebaseio.com',
        projectId: 'smart-city-ss2020',
        storageBucket: 'smart-city-ss2020.appspot.com',
        messagingSenderId: '957240233717'
});

/* Logging */
const dir = './logs';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

let debug_file = fs.createWriteStream('logs/debug.log', {flags : 'a+'});
let log_file = fs.createWriteStream('logs/node.log', {flags : 'a+'});
let error_file = fs.createWriteStream('logs/error.log', {flags : 'a+'});
let log_stdout = process.stdout;

function getTimestamp() {
    return new Date().toLocaleTimeString();
}

console.debug = function(d) {
    debug_file.write(getTimestamp() + ' ' + util.format(d) + '\n');
};
console.log = function(d) {
    log_file.write(getTimestamp() + ' ' + util.format(d) + '\n');
    log_stdout.write(getTimestamp() + ' ' + util.format(d) + '\n');
};
console.error = function(d) {
    log_file.write(getTimestamp() + ' ' + util.format(d) + '\n');
    error_file.write(getTimestamp() + ' ' + util.format(d) + '\n');
    log_stdout.write(getTimestamp() + ' ' + util.format(d) + '\n');
};

/*Start all components*/
console.log("Initial start up Bürgerbüro Server!");
console.log("-----------------------------------");

/*Routes*/
let channel = require('./components/messages');
require('./components/rest_server')(config, firebase, fbClient, channel, fs);
require('./components/grpc_server')(config, firebase);

let db = require('./components/database');
let dbFunctions = require('./database/initial-script')

db.sequelize.sync().then(function(){
    console.log('DB connection successful.');
    dbFunctions.createFirebaseUserAccounts(firebase);
}, function(err){
    console.log('DB connection not successful.');
});




