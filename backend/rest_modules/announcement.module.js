const path = require('path');
const announcementCtrl = require("../database/controller/announcement.controller");
const announcementVerificationCtrl = require("../database/controller/announcement_verification.controller");
const rb = require("../components/response_builder");

module.exports = function (app, firebase, config, caller) {
    const userProtoPath = path.resolve(__dirname, '../proto/announcement.proto');
    const client = caller('localhost:' + config.GRPC_PORT, userProtoPath, 'AnnouncementService');

    /**
     * Create new announcement
     * @param body Complete json object with all announcement data
     * @returns Status object
     */
    app.post("/announcement/create", async function (req, res) {
        console.log('REST CALL: /announcement/create');
        let responseObj = {};

        announcementCtrl.create(req.body).then(databaseResult => {
            if(databaseResult !== "Not created"){

                responseObj = rb.success("Announcement", "was created", databaseResult);
            } else {
                responseObj = rb.failure("creating", "announcement");
            }
            res.send(responseObj);
        });
    });

    /**
     * Create new announcement
     * @param body Complete json object with all found object data
     * @returns Status object
     */
    app.post("/foundObject/create", async function (req, res) {
        console.log('REST CALL: /foundObject/create');

        let responseObj = {};

        const announcement = {
            title: req.body.title,
            text: req.body.text,
            type: 'announcement',
            source: req.body.source,
            service: req.body.service,
            uid: req.body.uid,
            isActive: req.body.isActive,
            image: req.body.image
        };

        announcementCtrl.create(req.body).then(databaseResult => {
            if(databaseResult !== "Not created"){
                const validation = {
                    aid: databaseResult.id,
                    key1: req.body.question1,
                    key2: req.body.question2,
                    key3: req.body.question3,
                    value1: req.body.answer1,
                    value2: req.body.answer2,
                    value3: req.body.answer3,
                };

                announcementVerificationCtrl.createVerification(validation).then(databaseResultVerification => {
                    if(databaseResult !== "Not created"){
                        responseObj = rb.success("Found object", "was created", databaseResult);
                    } else {
                        responseObj = rb.failure("creating", "found object");
                    }
                    res.send(responseObj);
                });
            } else {
                responseObj = rb.failure("creating", "found object");
                res.send(responseObj);
            }

        });
    });
}
