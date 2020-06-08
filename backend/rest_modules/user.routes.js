const userCtrl = require("../database/controller/user.controller");

module.exports = function (app) {
    app.get("/user/:uid", userCtrl.findOne);
    app.get("/user", userCtrl.getAllUsers);
    app.put("/user/role/:uid", userCtrl.updateUserRole);
    app.put("/user/image/:uid", userCtrl.updateImageFromUser);
    app.delete("/user/image/:uid", userCtrl.deleteImageFromUser);
};
