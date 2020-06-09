const announcementCtrl = require("../database/controller/announcement.controller");

module.exports = function (app) {
    app.get("/announcement/inactive", announcementCtrl.getAllInactive);
    app.get("/announcement/active", announcementCtrl.getAllActive);
    app.put("/announcement/activate/:id", announcementCtrl.activate);
    app.put("/announcement/deactivate/:id", announcementCtrl.deactivate);
    app.delete("/announcement/:id", announcementCtrl.delete);
};
