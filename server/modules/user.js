const path = require('path');
const userCtrl = require("../database/controller/user.controller");

module.exports = function (app, firebase, config, caller) {
    const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
    const client = caller(config.BACKEND_HOST + ':50051', userProtoPath, 'UserService');

    /**
     * Register new user
     * @param user Complete json object with all user data
     * @returns Uid of the user or null if registering has failed
     */
    app.post("/registerUser", async function (req, res) {
        let responseObj = {};
        let userObj = JSON.parse(req.body.user);
        let displayName = (userObj.nickName == undefined || userObj.nickName == '') ? userObj.firstName + " " + userObj.lastName : userObj.nickName;
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
                    if(databaseResult != 'Not created'){
                        responseObj.status = "success";
                        responseObj.message = "User was created.";
                        responseObj.param = {
                            uid: user.uid
                        };
                    } else {
                        responseObj.status = "error";
                        responseObj.message = "Error on creating user in the database.";
                        responseObj.param = {};
                    }
                    res.send(responseObj);
                })
            })
            .catch(function (error) {
                responseObj.message = error;
                responseObj.param = {};
                res.send(responseObj);
            });
    });

    /**
     * Verify user token
     * @param token User token from the current authenticated user
     * @returns Uid if the token was successfully verified otherwise return null
     */
    app.post("/verifyUser", function (req, res) {
        let responseObj = {};
        client.verifyUser(req.body).then(result => {
            if(result.uid != null){
                let param = {
                    uid: result.uid
                }

                userCtrl.findOne(param).then(databaseResult => {
                    if(databaseResult != 'Not found'){
                        responseObj.status = "success";
                        responseObj.message = "Verified user";
                        responseObj.param = {
                            user: databaseResult.dataValues
                        };
                    } else {
                        responseObj.status = "error";
                        responseObj.message = "User could not found in the database.";
                        responseObj.param = {
                            user: null
                        };
                    }
                    res.send(responseObj);
                });
            } else {
                responseObj.status = "error";
                responseObj.message = "User could not be verified.";
                responseObj.param = {
                    user: null
                };
                res.send(responseObj);
            }
        }).catch((error) => {
            responseObj.status = "error";
            responseObj.message = error;
            responseObj.param = {
                user: null
            };
            res.send(responseObj);
        });
    });

    /**
     * Update existing user
     * @param uid Uid of of user the that should be registered
     * @returns User record object or error message if not successful
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
                gender: userObj.gender,
                firstName: userObj.firstName,
                lastName: userObj.lastName,
                nickName: userObj.nickName,
                email: userObj.email,
                birthDate: userObj.birthDate,
                streetAddress: userObj.streetAddress,
                zipCode: userObj.zipCode,
                city: 'Smart City',
                phone: userObj.phone,
                image: userObj.image,
                isActive: userObj.isActive
            };

            userCtrl.update(user).then (databaseResult => {
                if(databaseResult != 'Not updated'){
                    responseObj.status = "success";
                    responseObj.message = "Updated user";
                    responseObj.param = {
                        uid: user.uid
                    };
                } else {
                    responseObj.status = "error";
                    responseObj.message = "User could not updated in the database.";
                    responseObj.param = {};
                }
                res.send(responseObj);
            })
         }).catch(function(error) {
             responseObj.status = "error";
             responseObj.message = error;
             responseObj.param = {};
             res.send(responseObj);
         });
    });

    /**
     * Deactivate the given user
     * @param uid Uid of of user the that should be deactivated
     * @returns User record object or error message if not successful
     */
    app.post("/deactivate", function (req, res) {
        let uid = req.body.uid;
        let responseObj = {};
        firebase.auth().updateUser(uid, {
            deactivated: true
        }).then(function(userRecord) {
            let param = {
                uid: uid
            }

            userCtrl.deactivate(param).then(databaseResult => {
                if(databaseResult != 'Not deactivated'){
                    responseObj.status = "success";
                    responseObj.message = "Deactivated user";
                    responseObj.param = {
                        user: user
                    };
                } else {
                    responseObj.status = "error";
                    responseObj.message = "User could not be deactivated in the database.";
                    responseObj.param = {};
                }
                res.send(responseObj);
            });
        }).catch(function(error) {
            responseObj.status = "error";
            responseObj.message = error;
            responseObj.param = {};
            res.send(responseObj);
        });
    });
};
