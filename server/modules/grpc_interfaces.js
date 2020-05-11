require('./firebase.js');

module.exports = function (app) {
    /**
     * Get user dataset by uid
     * @param param Parameter object containing the uid of requested user
     * @returns User dataset of requested user or null if not successful
     */
    function getUser (param){
        let uid = param.req.uid;
        //TODO get user from database by uid and return userdata
    }

    /**
     * Verify a given user token
     * @param param Parameter object containing the user token of the user to verify
     * @returns Uid of the verified user or null if not successful
     */
    function verifyUser (param) {
        let idToken = param.req.token;
        let result = null;
        firebase.auth().verifyIdToken(idToken)
            .then(function(decodedToken) {
                result = decodedToken.uid;
            }).catch(function() {
                result = null;
        });
        param.res = { uid: result }
    }

    app.use({ verifyUser, getUser })
};

