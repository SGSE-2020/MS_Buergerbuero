module.exports = function (app, firebase) {
    /**
     * Register new user
     * @param nickname of the that should be registered
     * @param email of the user that should be registered
     * @param password of the user that should be registered
     * @returns Uid of the user or null if registering has failed
     */
    app.post("/registerUser", function (req, res) {
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;

        let responseObj = {};

        firebase.auth().createUser({
            email: email,
            emailVerified: false,
            password: password,
            displayName: username,
            disabled: true,
        })
            .then(function (userRecord) {
                responseObj.status = "success";
                responseObj.message = userRecord.uid;
                res.send(responseObj);
            })
            .catch(function (error) {
                responseObj.status = "error";
                responseObj.message = error;
                res.send(responseObj);
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
};
