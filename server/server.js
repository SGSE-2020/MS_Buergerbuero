const express = require("express");
const bodyParser = require('body-parser');
const path = require('path')
const Mali = require('mali')

const appRest = express();
appRest.use(bodyParser.json());
appRest.use(bodyParser.urlencoded({ extended: true }));

const protoPath = path.resolve(__dirname, './proto/user.proto')
const appGRpc = new Mali(protoPath, 'Greeter')

/*Header*/
appRest.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "x-xsrf-token, Content-Type");
    next();
});

/*Routes*/
require('./modules/user_management.js')(appRest, express);
require('./modules/grpc_interfaces');

/*Launch REST server*/
appRest.listen("9000", function () {
    console.log("Server running on port: 9000");
});

/*Launch gRPC server*/
appGRpc.start('127.0.0.1:50051')

