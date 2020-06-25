const rb = require('../../components/responseBuilder');
const db = require("../../components/database");
const announcementVerificationCtrl = require("./announcement_verification.controller");
const Announcement = db.announcements;
const AnnouncementVerification = db.announcement_verification;

/**
 * Create Announcement in the database
 * @param announcement Json object containing a announcement within the database
 */
exports.create = (announcement) => {
    return Announcement.create(announcement).then(data => {
        return data;
    }).catch(err => {
        console.log(err);
        return 'Error on creation';
    });
};
/**
 * Searched one Announcement in the database
 * @param announcement Json object containing a announcement within the database
 */
exports.find = (param) => {
    return Announcement.findByPk(param, {include: [{model: AnnouncementVerification}]}).then(data => {
        if(data){
            return data;
        } else {
            return 'Not found';
        }
    }).catch(err => {
        return 'Not found';
    });
};

/**
 * Searched one Announcement in the database
 * @param announcement Json object containing a announcement within the database
 */
exports.findOne = (param) => {
    return Announcement.findOne(param, {include: [{model: AnnouncementVerification}]}).then(data => {
        if(data){
            return data;
        } else {
            return 'Not found';
        }
    }).catch(err => {
        return 'Not found';
    });
};

/**
 * Get all announcements
 * @returns List of Announcement objects
 */
exports.getAll = (req, res) => {
    console.log("REST CALL: get -> /announcement");

    let responseObj = {};
    Announcement.findAll({include: [{model: AnnouncementVerification}]}).then(data => {
        if(data){
            responseObj = rb.success("Announcements", "found", data);
        } else {
            responseObj = rb.failure("Announcements", "finding");
        }
        res.send(responseObj);
    }).catch(err => {
        responseObj = rb.error(err);
        res.send(responseObj);
    });
};


/**
 * Get all active announcements
 * @returns List of Announcement objects
 */
exports.getAllActive = (req, res) => {
    console.log("REST CALL: get -> /announcement/active");

    let responseObj = {};
    Announcement.findAll({where: { isActive: true }, include: [{model: AnnouncementVerification}]}).then(data => {
        if(data){
            responseObj = rb.success("Active announcements", "found", data);
        } else {
            responseObj = rb.failure("Active announcements", "finding");
        }
        res.send(responseObj);
    }).catch(err => {
        responseObj = rb.error(err);
        res.send(responseObj);
    });
};

/**
 * Get all inactive announcements
 * @returns List of Announcement objects
 */
exports.getAllInactive = (req, res) => {
    console.log("REST CALL: get -> /announcement/inactive");

    let responseObj = {};
    Announcement.findAll({where: { isActive: false }, include: [{model: AnnouncementVerification}]}).then(data => {
        if(data){
            responseObj = rb.success("Inactive announcements", "found", data);
        } else {
            responseObj = rb.failure("Inactive announcements", "finding");
        }
        res.send(responseObj);
    }).catch(err => {
        responseObj = rb.error(err);
        res.send(responseObj);
    });
};

/**
 * Activate  a announcement from the db by the id of the announcement
 * @param id Id of the announcement that should be activated
 */
exports.activate = (req, res) => {
    console.log("REST CALL: put -> /announcement/activate/:id");

    const updateParam = {
        isActive: true
    }
    let responseObj = {};
    return Announcement.update(updateParam, {where: { id: req.params.id }}).then(data => {
        if(data){
            responseObj = rb.success("Announcement", "activated");
        } else {
            responseObj = rb.failure("Announcement", "activating");
        }
        res.send(responseObj);
    }).catch(err => {
        responseObj = rb.error(err);
        res.send(responseObj);
    });
};

/**
 * Deactivate a announcement from the db by the id of the announcement
 * @param id Id of the announcement that should be deactivated
 */
exports.deactivate = (req, res) => {
    console.log("REST CALL: put -> /announcement/deactivate/:id");

    const updateParam = {
        isActive: false
    }
    let responseObj = {};
    return Announcement.update(updateParam, {where: { id: req.params.id }}).then(data => {
        if(data){
            responseObj = rb.success("Announcement", "deactivated");
        } else {
            responseObj = rb.failure("Announcement", "deactivating");
        }
        res.send(responseObj);
    }).catch(err => {
        responseObj = rb.error(err);
        res.send(responseObj);
    });
};

/**
 * Delete a announcement from the db by the id of the announcement
 * @param id Id of the announcement that should be deleted
 */
exports.delete = (req, res) => {
    console.log("REST CALL: delete -> /announcement/:id");

    let responseObj = {};

    announcementVerificationCtrl.delete(req.params.id ).then(data => {
        if(data){
            Announcement.destroy({where: { id: req.params.id }}).then(data => {
                if(data){
                    responseObj = rb.success("Announcement", "deleted");
                } else {
                    responseObj = rb.failure("Announcement", "deleting");
                }
                res.send(responseObj);
            }).catch(err => {
                responseObj = rb.error(err);
                res.send(responseObj);
            });
        } else {
            responseObj = rb.failure("Announcement", "deleting");
            res.send(responseObj);
        }
    });
};

/**
 * Delete a announcement from the db by the id of the announcement manually
 * @param param Id of the announcement that should be deleted
 */
exports.deleteManually = (param) => {
    return Announcement.destroy({where: { id: param }, include: [{model: AnnouncementVerification}]}).then(data => {
        if(data){
            return data;
        } else {
            return 'Not deleted';
        }
    }).catch(err => {
        return 'Not deleted';
    });
};




