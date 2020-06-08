const path = require('path');
const userCtrl = require("../database/controller/user.controller");
const rb = require("../components/response_builder");
const db = require("../components/database");
const config = require('../components/config');

module.exports = function (app, firebase, config, caller, channel) {
    const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
    const client = caller('localhost:' + config.GRPC_PORT, userProtoPath, 'UserService');

    /**
     * Register new user
     * @param body Complete json object with all user data
     * @returns Status object with uid param if successful
     */
    app.post("/user/register", async function (req, res) {
        console.log('REST CALL: /user/register');

        let responseObj = {};
        let userObj = req.body;
        let displayName = (userObj.nickName === undefined || userObj.nickName === '') ? userObj.firstName + " " + userObj.lastName : userObj.nickName;

        db.sequelize.authenticate().then(() => {
            firebase.auth().createUser({
                email: userObj.email,
                emailVerified: true,
                password: userObj.password,
                displayName: displayName,
                disabled: false,
            }).then(function (userRecord) {
                const user = {
                    uid: userRecord.uid,
                    gender: userObj.gender,
                    firstName: userObj.firstName,
                    lastName: userObj.lastName,
                    nickName: displayName,
                    email: userObj.email,
                    birthDate: userObj.birthDate,
                    streetAddress: userObj.streetAddress,
                    zipCode: userObj.zipCode,
                    city: 'Smart City',
                    phone: userObj.phone,
                    image: '',
                    isActive: true
                };

                userCtrl.create(user).then(databaseResult => {
                    if(databaseResult !== "Not created"){
                        responseObj = rb.success("User", "was created", {
                            uid: user.uid
                        });
                    } else {
                        responseObj = rb.failure("creating", "user");
                    }
                    res.send(responseObj);
                });
            }).catch(function (err) {
                responseObj = rb.error(err);
                responseObj.err = err;
                res.send(responseObj);
            });
        }).catch(err => {
            console.log(err);
            responseObj.status = "error";
            responseObj.code = "";
            responseObj.message = "Database is not available.";
            responseObj.param = {};
        });
    });

    /**
     * Verify user token
     * @param token User token from the current authenticated user
     * @returns Status object with uid param if successful
     */
    app.post("/user/verify/:token", function (req, res) {
        console.log('REST CALL: /user/verify');

        let responseObj = {};
        firebase.auth().verifyIdToken(req.params.token).then(result => {
            if(result.uid != null){
                responseObj = rb.success("User", "was verified", {
                    uid : result.uid,
                    role: 1
                });
            } else {
                responseObj = rb.failure("verifying", "user");
            }
            res.send(responseObj);
        }).catch((err) => {
            responseObj = rb.error(err);
            responseObj.err = err;
            res.send(responseObj);
        });
    });

    /**
     * Update existing user
     * @param uid Uid of of user the that should be updated
     * @param body User object that should be updated in the database
     * @returns Status object with user param if successful
     */
    app.post("/user/update/:uid", function (req, res) {
        console.log('REST CALL: /user/update');

        let userObj = req.body
        let responseObj = {};

        firebase.auth().updateUser(req.params.uid, {
            email: userObj.email,
            displayName: userObj.nickName
        }).then(function(userRecord) {
            const user = {
                uid: userObj.uid,
                firstName: userObj.firstName,
                lastName: userObj.lastName,
                nickName: userObj.nickName,
                email: userObj.email,
                birthDate: userObj.birthDate,
                streetAddress: userObj.streetAddress,
                zipCode: userObj.zipCode,
                phone: userObj.phone
            };

            userCtrl.update(user).then (databaseResult => {
                if(databaseResult !== "Not updated"){
                    responseObj = rb.success("User", "was updated", {
                        user: databaseResult
                    });
                } else {
                    responseObj = rb.failure("updating", "user");
                }
                res.send(responseObj);
            })
         }).catch(function(err) {
            responseObj = rb.error(err);
            responseObj.err = err;
            res.send(responseObj);
         });
    });

    /**
     * Deactivate the given user
     * @param uid Uid of of user the that should be deactivated
     * @returns Status object with user param if successful
     */
    app.post("/user/deactivate/:uid", function (req, res) {
        console.log('REST CALL: /user/deactivate');

        let responseObj = {};
        firebase.auth().updateUser(req.params.uid, {
            disabled: true
        }).then(function(userRecord) {
            if(userRecord.disabled === true){
                userCtrl.deactivate(req.params).then(databaseResult => {
                    if(databaseResult !== "Not deactivated"){
                        responseObj = rb.success("User", "was deactivated", {
                            user: databaseResult
                        });
                    } else {
                        responseObj = rb.failure("deactivating", "user");
                    }
                    res.send(responseObj);
                });
            } else {
                responseObj = rb.failure("deactivating", "user");
            }
        }).catch(function(err) {
            responseObj = rb.error(err);
            responseObj.err = err;
            res.send(responseObj);
        });
    });
};
