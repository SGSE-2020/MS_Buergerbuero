const express = require("express");
const bodyParser = require('body-parser');
const config = require('./config');
const app = express();

const caller = require('grpc-caller')

module.exports = function(config, firebase, channel, fs){
    app.use(bodyParser.json({limit: '50mb', extended: true}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

    /*Header*/
    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "*");
        next();
    });

    /**
     * Returns if the rest server is alive
     */
    app.get("/alive", function(req, res) {
        console.log("REST CALL: /alive");
        let responseObj = {
            status:"success",
            message: "Server is alive."
        }
        res.status(200);
        res.send(responseObj);
    });

    /**
     * Returns the log file based on level
     */
    app.get("/showLog/:level", function(req, res) {
        console.log("REST CALL: /showLog/:level");
        const level = req.params.level || 'node';

        let responseObj = {};
        if (['node', 'debug', 'error'].includes(level)) {
            fs.readFile('logs/' + level + '.log', function(err, data) {
                if (err) {
                    responseObj = {
                        status:"error",
                        message: level + " log file was not found.",
                        param: {}
                    }
                    res.send(responseObj);
                } else {
                    // todo format much prettier
                    res.send("<body style='font-family: Courier'>" + data.toString().replace(/\n/g, "<br>") + "</body>");
                }
            });
        } else {
            responseObj = {
                status:"error",
                message: level + " is not available.",
                param: {}
            }
            res.send(responseObj);
        }
    });

    require('../rest_modules/user.module')(app, firebase, config, caller, channel);
    require('../rest_modules/user.routes')(app);
    require('../rest_modules/announcement.module')(app, firebase, config, caller);
    require('../rest_modules/announcement.routes')(app);

    /*Launch REST server*/
    app.listen(config.REST_PORT, function () {
        console.log("REST Server running on port: " + config.REST_PORT);
    });
}
