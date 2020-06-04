const announcementCtrl = require("../database/controller/announcement.controller");

module.exports = function (app) {
    app.get("/announcement/inactive", announcementCtrl.getAllInactive);
    app.get("/announcement/active", announcementCtrl.getAllActive);
    app.post("/announcement/activate/:id", announcementCtrl.activate);
    app.post("/announcement/deactivate/:id", announcementCtrl.deactivate);
};
