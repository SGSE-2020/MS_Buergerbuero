const path = require('path');
const mali = require('mali');
const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
const gRpcServer = new mali(userProtoPath, 'UserService');

module.exports = function(firebase){
    /**
     * Get user dataset by uid
     * @param param Parameter object containing the uid of requested user
     * @returns User dataset of requested user or null if not successful
     */
    function getUser (param){
        let user = {};
        //TODO get user from database by uid and return userdata
        param.res = user;
    }

    /**
     * Verify a given user token
     * @param param Parameter object containing the user token of the user to verify
     * @returns Uid of the verified user or null if not successful
     */
    async function verifyUser (param) {
        let idToken = param.req.token;
        let result = {};
        firebase.auth().verifyIdToken(idToken)
            .then(function(decodedToken) {
                console.log("Verification of token: '" + idToken + "' was successful. Uid is: '" + decodedToken.uid + "'")
                result.uid = decodedToken.uid;
            }).catch(function() {
                console.log("Verification of token: '" + idToken + "' was not successful.")
                result.uid = null;
        });
        param.res = result;
    }

    /*Launch gRPC server*/
    gRpcServer.use({ verifyUser, getUser })
    gRpcServer.start('127.0.0.1:50051');
    console.log("gRPC Server running on port: 50051");
}



