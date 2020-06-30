const userCtrl = require("../database/controller/user.controller");

module.exports = function (app) {
    app.get("/user/:uid", userCtrl.findOne);
    app.get("/user", userCtrl.getAllUsers);
    app.put("/user/role/:uid", userCtrl.updateUserRole);
};
