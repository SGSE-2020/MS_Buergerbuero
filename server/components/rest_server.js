const express = require("express");
const bodyParser = require('body-parser');
const app = express();

const caller = require('grpc-caller')

module.exports = function(config, firebase){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    /*Header*/
    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "x-xsrf-token, Content-Type");
        next();
    });

    /*Routes*/
    let db = require('../components/database');
    db.sequelize.sync();

    require('../modules/user')(app, firebase, config, caller);
    require('../modules/announcement')(app, firebase, config, caller);

    /*Launch REST server*/
    app.listen("9000", function () {
        console.log("REST Server running on port: 9000");
    });
}

