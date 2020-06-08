const rb = require('../../components/response_builder');
const db = require("../../components/database");
const Announcement = db.announcements;

/**
 * Create Announcement in the database
 * @param announcement Json object containing a announcement within the database
 */
exports.create = (announcement) => {
    console.log(announcement);
    return Announcement.create(announcement).then(data => {
        if(data){
            return data;
        } else {
           return 'Not created';
        }
    }).catch(err => {
        return 'Not created';
    });
};

/**
 * Get all active announcements
 * @returns List of Announcement objects
 */
exports.getAllActive = (req, res) => {
    console.log("REST CALL: get -> /announcement/active");

    let responseObj = {};
    Announcement.findAll({where: { isActive: true }}).then(data => {
        if(data){
            responseObj = rb.success("Active announcements", "found", { announcements: data });
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
    Announcement.findAll({where: { isActive: false }}).then(data => {
        if(data){
            responseObj = rb.success("Inactive announcements", "found", { announcements: data });
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



