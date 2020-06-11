const path = require('path');
const mali = require('mali');
const conf = require('./config');

const gRpcServer = new mali();
const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
const announcementProtoPath = path.resolve(__dirname, '../proto/announcement.proto');
gRpcServer.addService(userProtoPath, 'UserService');
gRpcServer.addService(announcementProtoPath, 'AnnouncementService');

const userCtrl = require("../database/controller/user.controller");
const announcementCtrl = require("../database/controller/announcement.controller");

module.exports = function(config, firebase){
    /**
     * Get user dataset by uid
     * @param param Parameter object containing the uid of requested user
     * @returns User dataset of requested user or null if not successful
     */
    function getUser (param){
        console.log("GRPC CALL: UserService -> getUser");

        userCtrl.findOneManually(param.req.uid).then(databaseResult => {
            if(databaseResult !== 'Not found'){
                let responseObj = {
                    uid: databaseResult.dataValues.uid,
                    gender: databaseResult.dataValues.gender,
                    firstName: databaseResult.dataValues.firstName,
                    lastName: databaseResult.dataValues.lastName,
                    nickName: databaseResult.dataValues.nickName,
                    email: databaseResult.dataValues.email,
                    birthDate: databaseResult.dataValues.birthDate.toDateString(),
                    streetAddress: databaseResult.dataValues.streetAddress,
                    zipCode: databaseResult.dataValues.zipCode,
                    city: databaseResult.dataValues.city,
                    phone: databaseResult.dataValues.phone,
                    image: databaseResult.dataValues.image,
                    isActive: databaseResult.dataValues.isActive
                }
                param.res = responseObj;
            } else {
                param.res = null;
            }
        })
    }

    /**
     * Verify a given user token
     * @param param Parameter object containing the user token of the user to verify
     * @returns Uid of the verified user or null if not successful
     */
    async function verifyUser (param) {
        console.log("GRPC CALL: UserService -> verifyUser");
        let decodedToken = await firebase.auth().verifyIdToken(param.req.token);
        if(decodedToken !== undefined){
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
    function sendAnnouncement (param) {
        console.log("GRPC CALL: AnnouncementService -> sendAnnouncement");
        //TODO create announcement in db and get the id from the inserted entry
        //TODO replace example response after database result
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
    function deleteAnnouncement (param) {
        console.log("GRPC CALL: AnnouncementService -> deleteAnnouncement");
        //TODO delete the announcement from the database
        //TODO replace example response after database result
        param.res = {
            status: 'Success',
            message: 'Aushang wurde vom schwarzen Brett gelöscht.'
        };
    }

    /*Launch gRPC server*/
    gRpcServer.use({ verifyUser, getUser, sendAnnouncement, deleteAnnouncement});
    gRpcServer.start("0.0.0.0:" + conf.GRPC_PORT);
    console.log("gRPC Server running on port: " + conf.GRPC_PORT);
}



