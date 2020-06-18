const path = require('path');
const mali = require('mali');

const gRpcServer = new mali();
const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
const announcementProtoPath = path.resolve(__dirname, '../proto/announcement.proto');
gRpcServer.addService(userProtoPath, 'UserService');
gRpcServer.addService(announcementProtoPath, 'AnnouncementService');

const userCtrl = require("../database/controller/user.controller");
const announcementCtrl = require("../database/controller/announcement.controller");

module.exports = function(firebase){
    /**
     * Get user dataset by uid
     * @param param Parameter object containing the uid of requested user
     * @returns User dataset of requested user or empty object if not successful
     */
    async function GetUser (param){
        console.log("GRPC CALL: UserService -> getUser");

        try{
            let databaseResult = await userCtrl.findOneManually(param.req);
            if(databaseResult !== 'Not found'){
                console.log("SUCCESS: User was found. Return user data.");
                delete databaseResult.dataValues["createdAt"];
                delete databaseResult.dataValues["updatedAt"];
                delete databaseResult.dataValues["role"];
                param.res = databaseResult.dataValues;
            } else {
                console.error("ERROR: User could not be found in  the database.");
                param.res = {
                    uid: null,
                    gender: null,
                    firstName: null,
                    lastName: null,
                    nickName: null,
                    email: null,
                    birthDate: null,
                    streetAddress: null,
                    zipCode: null,
                    city: null,
                    phone: null,
                    image: null,
                    isActive: null
                };
            }
        } catch (err) {
            console.error("ERROR: " + err.message);
            param.res = {
                uid: null,
                gender: null,
                firstName: null,
                lastName: null,
                nickName: null,
                email: null,
                birthDate: null,
                streetAddress: null,
                zipCode: null,
                city: null,
                phone: null,
                image: null,
                isActive: null
            };
        }

    }

    /**
     * Verify a given user token
     * @param param Parameter object containing the user token of the user to verify
     * @returns Uid of the verified user or or empty object if not successful
     */
    async function VerifyUser (param) {
        console.log("GRPC CALL: UserService -> verifyUser");

        try{
            let decodedToken = await firebase.auth().verifyIdToken(param.req.token);
            if(decodedToken !== undefined){
                console.log("SUCCESS: User was verified");
                param.res = {
                    uid: decodedToken.uid
                };
            } else {
                console.error("ERROR: User could not be verified");
                param.res = {
                    uid: null
                };
            }
        } catch(err){
            console.error("ERROR: " + err.message);
            param.res = {
                uid: null
            };
        }

    }

    /**
     * Create an announcement to be shown at the blackboard
     * @param param Parameter object containing title, text and image for the announcement
     * such as the service the announcement originates from
     * @returns The created announcement object or empty object if not successful
     */
    async function sendAnnouncement (param) {
        console.log("GRPC CALL: AnnouncementService -> sendAnnouncement");

        param.req.source = 'Dienstleister';
        param.req.type = 'announcement';

        try{
            let databaseResult = await announcementCtrl.create(param.req);
            if(databaseResult !== "Error on creation"){
                console.log("SUCCESS: Announcement successfully created. Returning announcement.");
                delete databaseResult.dataValues["createdAt"];
                delete databaseResult.dataValues["updatedAt"];
                delete databaseResult.dataValues["uid"];
                param.res = databaseResult.dataValues;
            } else {
                console.error("ERROR: Announcement could not be created in database.");
                param.res = {
                    id: null,
                    title: null,
                    text: null,
                    type: null,
                    image: null,
                    source: null,
                    service: null,
                    isActive: null,
                };
            }
        } catch(err) {
            console.error("ERROR: " + err.message);
            param.res = {
                id: null,
                title: null,
                text: null,
                type: null,
                image: null,
                source: null,
                service: null,
                isActive: null,
            };
        }

    }

    /**
     * Delete an existing announcement to be deleted from the blackboard
     * @param param Parameter object containing the announcement id and the service the
     * announcement originates from
     * @returns Status object containing state and message
     */
    async function deleteAnnouncement (param) {
        console.log("GRPC CALL: AnnouncementService -> deleteAnnouncement");
        console.log(param.req);
        try{
            let dataFind = await announcementCtrl.find(param.req.id);
            if(dataFind){
                if (dataFind.service === param.req.service){
                    let dataDelete = await announcementCtrl.deleteManually(param.req.id);
                    if (dataDelete){
                        console.log("SUCCESS: Aushang wurde erfolgreich gelöscht.");
                        param.res = {
                            status: 'success',
                            message: 'Aushang wurde gelöscht.'
                        };
                    } else {
                        console.error("ERROR: Aushang konnte nicht gelöscht werden. Versuchen Sie es später noch einmal.");
                        param.res = {
                            status: 'error',
                            message: 'Aushang konnte nicht gelöscht werden. Versuchen Sie es später noch einmal.'
                        };
                    }
                } else {
                    console.error("ERROR: Validierung fehlgeschlagen. Service stimmt nicht überein.");
                    param.res = {
                        status: 'error',
                        message: 'Validierung fehlgeschlagen. Service stimmt nicht überein.'
                    };
                }
            } else {
                console.error("ERROR: Aushang konnte nicht gefunden werden.");
                param.res = {
                    status: 'error',
                    message: 'Aushang konnte nicht gefunden werden.'
                };
            }
        } catch (err){
            console.error("ERROR: " + err.message);
            param.res = {
                status: 'error',
                message: err.message
            };
        }


    }

    /*Launch gRPC server*/
    gRpcServer.use({ VerifyUser, GetUser, sendAnnouncement, deleteAnnouncement});
    gRpcServer.start("0.0.0.0:" + process.env.GRPC_PORT);
    console.log("gRPC Server running on port: " + process.env.GRPC_PORT);
}



