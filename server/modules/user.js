const path = require('path');
const caller = require('grpc-caller')
const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
const client = caller('127.0.0.1:50051', userProtoPath, 'UserService');

module.exports = function (app, firebase) {
    /**
     * Register new user
     * @param nickname of the that should be registered
     * @param email of the user that should be registered
     * @param password of the user that should be registered
     * @returns Uid of the user or null if registering has failed
     */
    app.post("/registerUser", function (req, res) {
        let responseObj = {};
        let user = JSON.parse(req.body.newUser);
        firebase.auth().createUser({
            email: user.email,
            emailVerified: true,
            password: user.password,
            displayName: user.nickname,
            disabled: false,
        })
            .then(function (userRecord) {
                responseObj.success = true;
                responseObj.message = userRecord.uid;
                res.send(responseObj);
                //todo add user data to database
            })
            .catch(function (error) {
                responseObj.success = false;
                responseObj.message = error;
                res.send(responseObj);
            });
    });

    /**
     * Verify user token
     * @param token User token from the current authenticated user
     * @returns Uid if the token was successfully verified otherwise return null
     */
    app.post("/verifyUser", function (req, res) {
        let userResponse = {};
        client.verifyUser(req.body).then((result) => {
            console.log(result);
            if(result.uid != null){
                // todo get role of user
                userResponse.success = true;
                userResponse.role = 1;
                res.send(userResponse);
            } else {
                userResponse.success = false;
                userResponse.role = 0;
                res.send(userResponse);
            }
        }).catch((error) => {
            console.log(error);
            userResponse.success = false;
            userResponse.role = 0;
            res.send(userResponse);
        });
    });

    /**
     * Update existing user
     * @param uid Uid of of user the that should be registered
     * @returns User record object or error message if not successful
     */
    app.post("/updateUser", function (req, res) {
        let uid = req.body.uid;
        //todo get more information about the user

        let responseObj = {};

        firebase.auth().updateUser(uid, {
            //todo add properties to change here
        })
            .then(function(userRecord) {
                responseObj.status = "success";
                responseObj.message = userRecord.toJSON();
                res.send(responseObj);
            })
            .catch(function(error) {
                responseObj.status = "error";
                responseObj.message = error
                res.send(responseObj);
            });
    });

    /**
     * Deactivate the given user
     * @param uid Uid of of user the that should be deactivated
     * @returns User record object or error message if not successful
     */
    app.post("/deactivateUser", function (req, res) {
        let uid = req.body.uid;
        let responseObj = {};
        firebase.auth().updateUser(uid, {
            deactivated: true
        })
            .then(function(userRecord) {
                responseObj.status = "success";
                responseObj.message = userRecord.toJSON();
                res.send(responseObj);
            })
            .catch(function(error) {
                responseObj.status = "error";
                responseObj.message = error
                res.send(responseObj);
            });
    });
};
