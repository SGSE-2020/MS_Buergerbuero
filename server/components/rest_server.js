const express = require("express");
const bodyParser = require('body-parser');
const app = express();

module.exports = function(firebase){
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

    require('../components/database.routes')(app, express);

    require('../modules/user')(app, firebase);
    require('../modules/announcement');

    /*Launch REST server*/
    app.listen("9000", function () {
        console.log("REST Server running on port: 9000");
    });
}

