const path = require('path');
const announcementCtrl = require("../database/controller/announcement.controller");
const announcementVerificationCtrl = require("../database/controller/announcement_verification.controller");

module.exports = function (app, firebase, config, caller) {
    const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
    const client = caller(config.BACKEND_HOST + ':50051', userProtoPath, 'UserService');
}
