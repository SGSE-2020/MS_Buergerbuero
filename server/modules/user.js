const path = require('path');
const userCtrl = require("../database/controller/user.controller");

module.exports = function (app, firebase, config, caller) {
    const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
    const client = caller(config.BACKEND_HOST + ':50051', userProtoPath, 'UserService');

    /**
     * Register new user
     * @param user Complete json object with all user data
     * @returns Status object with uid param if successful
     */
    app.post("/registerUser", async function (req, res) {
        let responseObj = {};
        let userObj = JSON.parse(req.body.user);
        let displayName = (userObj.nickName === undefined || userObj.nickName === '') ? userObj.firstName + " " + userObj.lastName : userObj.nickName;
        firebase.auth().createUser({
            email: userObj.email,
            emailVerified: true,
            password: userObj.password,
            displayName: displayName,
            disabled: false,
        })
            .then(function (userRecord) {
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
                        responseObj.status = "success";
                        responseObj.code = "";
                        responseObj.message = "User was created.";
                        responseObj.param = {
                            uid: user.uid
                        };
                    } else {
                        responseObj.status = "error";
                        responseObj.code = "";
                        responseObj.message = "Error on creating user in the database.";
                        responseObj.param = {};
                    }
                    res.send(responseObj);
                })
            })
            .catch(function (err) {
                responseObj.status = "error";
                responseObj.code = err.code;
                responseObj.message = err.message;
                responseObj.param = {};
                res.send(responseObj);
            });
    });

    /**
     * Verify user token
     * @param token User token from the current authenticated user
     * @returns Status object with uid param if successful
     */
    app.post("/verifyUser", function (req, res) {
        let responseObj = {};
        client.verifyUser(req.body).then(result => {
            if(result.uid != null){
                let param = {
                    uid: result.uid
                }

                userCtrl.findOne(param).then(databaseResult => {
                    if(databaseResult !== "Not found"){
                        responseObj.status = "success";
                        responseObj.code = "";
                        responseObj.message = "Verified user";
                        responseObj.param = {
                            user: databaseResult.dataValues
                        };
                    } else {
                        responseObj.status = "error";
                        responseObj.code = "";
                        responseObj.message = "User could not found in the database.";
                        responseObj.param = {};
                    }
                    res.send(responseObj);
                });
            } else {
                responseObj.status = "error";
                responseObj.code = "";
                responseObj.message = "User could not be verified.";
                responseObj.param = {};
                res.send(responseObj);
            }
        }).catch((err) => {
            responseObj.status = "error";
            responseObj.code = err.code;
            responseObj.message = err.message;
            responseObj.param = {};
            res.send(responseObj);
        });
    });

    /**
     * Update existing user
     * @param uid Uid of of user the that should be registered
     * @returns Status object with user param if successful
     */
    app.post("/updateUser", function (req, res) {
        let userObj = JSON.parse(req.body.user);
        let responseObj = {};

        firebase.auth().updateUser(userObj.uid, {
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
                    responseObj.status = "success";
                    responseObj.code = "";
                    responseObj.message = "Updated user";
                    responseObj.param = {
                        result: databaseResult.dataValues
                    };
                } else {
                    responseObj.status = "error";
                    responseObj.code = "";
                    responseObj.message = "User could not updated in the database.";
                    responseObj.param = {};
                }
                res.send(responseObj);
            })
         }).catch(function(err) {
            responseObj.status = "error";
            responseObj.code = err.code;
            responseObj.message = err.message;
            responseObj.param = {};
            res.send(responseObj);
         });
    });

    /**
     * Deactivate the given user
     * @param uid Uid of of user the that should be deactivated
     * @returns Status object with user param if successful
     */
    app.post("/deactivateUser", function (req, res) {
        let uid = req.body.uid;
        console.log(req.body);
        let responseObj = {};
        firebase.auth().updateUser(uid, {
            disabled: true
        }).then(function(userRecord) {
            console.log(userRecord);
            if(userRecord.disabled === true){
                let param = {
                    uid: uid
                }
                userCtrl.deactivate(param).then(databaseResult => {
                    if(databaseResult !== "Not deactivated"){
                        responseObj.status = "success";
                        responseObj.code = "";
                        responseObj.message = "Deactivated user";
                        responseObj.param = {
                            result: databaseResult.dataValues
                        };
                    } else {
                        responseObj.status = "error";
                        responseObj.code = "";
                        responseObj.message = "User could not be deactivated in the database.";
                        responseObj.param = {};
                    }
                    res.send(responseObj);
                });
            } else {
                responseObj.status = "error";
                responseObj.code = "";
                responseObj.message = "User could not be deactivated in firebase.";
                responseObj.param = {};
            }
        }).catch(function(err) {
            responseObj.status = "error";
            responseObj.code = err.code;
            responseObj.message = err.message;
            responseObj.param = {};
            res.send(responseObj);
        });
    });
};
