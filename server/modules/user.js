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

        firebase.auth().createUser({
            email: req.body.email,
            emailVerified: false,
            password: req.body.password,
            displayName: "",
            disabled: false,
        })
            .then(function (userRecord) {
                responseObj.status = "success";
                responseObj.message = userRecord.uid;
                res.send(responseObj);
                //todo add user data to database
            })
            .catch(function (error) {
                responseObj.status = "error";
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
        client.verifyUser(req.body).then((result) => {
            if(result.uid == null){
                res.send(false);
            } else {
                res.send(true);
            }
        }).catch((error) => {
            console.log(error);
            res.send(false);
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