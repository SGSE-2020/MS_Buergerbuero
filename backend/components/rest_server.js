const express = require("express");
const bodyParser = require('body-parser');
const app = express();

const caller = require('grpc-caller')

module.exports = function(config, firebase, channel){
    app.use(bodyParser.json({limit: '50mb', extended: true}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

    /*Header*/
    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "*");
        next();
    });

    require('../rest_modules/user.module')(app, firebase, config, caller, channel);
    require('../rest_modules/user.routes')(app);
    require('../rest_modules/announcement.module')(app, firebase, config, caller);
    require('../rest_modules/announcement.routes')(app);

    /*Launch REST server*/
    app.listen("8080", function () {
        console.log("REST Server running on port: 8080");
    });
}

