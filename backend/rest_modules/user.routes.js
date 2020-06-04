const userCtrl = require("../database/controller/user.controller");

module.exports = function (app) {
    app.get("/user/:uid", userCtrl.findOne);
    app.post("/user/image/:uid", userCtrl.updateImageFromUser);
};
