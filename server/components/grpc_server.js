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
        //TODO get user from database by uid and return userdata
        //TODO return null is not successful
        let exampleUser = {};
        exampleUser.uid = param.uid;
        exampleUser.gender = 1;
        exampleUser.firstName = "Max";
        exampleUser.lastName = "Meyer";
        exampleUser.nickname = "m.meyer";
        exampleUser.email = "exampleuser@test.de";
        exampleUser.birthDate = new Date();
        exampleUser.streetAdress = "Birkenweg 12";
        exampleUser.zipcode = "12345";
        exampleUser.city = "Smart City";
        exampleUser.phone = "01234/5678910";
        exampleUser.image = "";
        exampleUser.IsActive = true;
        param.res = exampleUser;
    }

    /**
     * Verify a given user token
     * @param param Parameter object containing the user token of the user to verify
     * @returns Uid of the verified user or null if not successful
     */
    async function verifyUser (param) {
        console.log(param.req);
        let decodedToken = await firebase.auth().verifyIdToken(param.req.token);
        if(decodedToken != undefined){
            param.res = {
                uid: decodedToken.uid
            };
        } else {
            param.res = {
                uid: null
            };
        }
    }

    /**
     * Create an announcement to be shown at the blackboard
     * @param param Parameter object containing title, text and image for the announcement
     * such as the service the announcement originates from
     * @returns Id of the created announcement or null if not successful
     */
    async function sendAnnouncement (param) {
        //TODO create announcement in db and get the id from the inserted entry
        param.res = {
            id: '12345'
        };
    }

    /**
     * Delete an existing announcement to be deleted from the blackboard
     * @param param Parameter object containing the announcement id and the service the
     * announcement originates from
     * @returns Status object containing state and message
     */
    async function deleteAnnouncement (param) {
        //TODO delete the announcement from the database
        param.res = {
            status: 'Success',
            message: 'Aushang wurde vom schwarzen Brett gelöscht.'
        };
    }

    /*Launch gRPC server*/
    gRpcServer.use({ verifyUser, getUser})
    gRpcServer.start('127.0.0.1:50051');
    console.log("gRPC Server running on port: 50051");
}



