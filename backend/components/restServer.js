const express = require("express");
const bodyParser = require('body-parser');
const app = express();

module.exports = function(firebase, fbClient, messageService, fs){
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

        const data = {
            message: 'Test'
        };
        messageService.publishToExchange(process.env.QUEUE_USER_DEACTIVATE, data);

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
                        message: "Logfile with level '" + level + "' was not found.",
                        param: {}
                    }
                    console.error(responseObj.message);
                    res.send(responseObj);
                } else {
                    // todo format much prettier
                    console.log("Log file was send.");
                    res.send("<body style='font-family: Courier'>" + data.toString().replace(/\n/g, "<br>") + "</body>");
                }
            });
        } else {
            responseObj = {
                status:"error",
                message: "Loglevel '" + level + "' is not available.",
                param: {}
            }
            console.error(responseObj.message);
            res.send(responseObj);
        }
    });

    require('../rest_modules/user.module')(app, firebase, fbClient, messageService);
    require('../rest_modules/user.routes')(app);
    require('../rest_modules/announcement.module')(app, firebase);
    require('../rest_modules/announcement.routes')(app);

    /*Launch REST server*/
    app.listen(process.env.REST_PORT, function () {
        console.log("REST Server running on port: " + process.env.REST_PORT);
    });
}
