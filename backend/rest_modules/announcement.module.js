const announcementCtrl = require("../database/controller/announcement.controller");
const announcementVerificationCtrl = require("../database/controller/announcement_verification.controller");
const rb = require("../components/responseBuilder");

module.exports = function (app, firebase) {
    /**
     * Create new announcement
     * @param body Complete json object with all announcement data
     * @returns Status object
     */
    app.post("/announcement/", async function (req, res) {
        console.log('REST CALL: post -> /announcement/');
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
     * Create new found object
     * @param body Complete json object with all found object data
     * @returns Status object
     */
    app.post("/foundObject/", async function (req, res) {
        console.log('REST CALL: post -> /foundObject/');

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

    /**
     * Receive found object
     * @param aid Id of the announcement to receive
     * @param body Complete json object with all answers for found object
     * @returns Status object
     */
    app.post("/announcement/receive/:aid", function (req, res) {
        console.log('REST CALL: post -> /announcement/receive/:announcementId');

        let responseObj = {};
        announcementCtrl.find(req.params.aid).then(announcement => {
            const validationObj = announcement.announcement_verification.dataValues;
            const verificationId = validationObj.id;
            if(validationObj.value1 === req.body.answer1 && validationObj.value2 === req.body.answer2
                && validationObj.value3 === req.body.answer3){
                announcementCtrl.deleteManually(req.params.aid ).then(() => {
                    announcementVerificationCtrl.delete(verificationId);
                    responseObj = rb.success("Found object", "was received");
                    res.send(responseObj);
                }).catch(err => {
                    responseObj = rb.error(err);
                    res.send(responseObj);
                });
            } else {
                responseObj = rb.failure("receiving", "found object");
                res.send(responseObj);
            }
        })
    });
}
