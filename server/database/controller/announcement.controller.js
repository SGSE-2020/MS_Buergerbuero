const db = require("../../components/database");
const Announcement = db.announcements;

/**
 * Create Announcement in the database
 * @param param Json object containing a announcement within the database
 */
exports.create = (param) => {
    console.log("Store new announcement!");
    return Announcement.create(param).then(data => {
        if(data){
            console.log("Stored new announcement with id: '"+ param.id +"' in database.");
            return data;
        } else {
            console.log("Error on storing new announcement with id: '"+ param.id +"' in database.");
            return 'Not created';
        }
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Not created';
    });
};

/**
 * Find a announcement by id
 * @param param Json object containing a id of announcement to search in the database
 * @returns Announcement object
 */
exports.findOne = (param) => {
    const id = param.id;
    return Announcement.findByPk(id).then(data => {
        if(data){
            return data;
        } else {
            return 'Not found';
        }
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Not found';
    });
};

/**
 * Get all active announcements
 * @returns List of Announcement objects
 */
exports.getAllActive = () => {
    return Announcement.findAll({where: { isActive: true }}).then(data => {
        if(data){
            return data;
        } else {
            return 'Not found';
        }
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Not found';
    });
};

/**
 * Deactivate or activate a announcement from the db by the id of the announcement
 * @param param Json object containing the id of the announcement and a value of isActive value
 */
exports.changeStatus = (param) => {
    console.log("Change status of an existent announcement!");

    const id = param.id;
    const updateParam = {
        isActive: param.isActive
    }

    return Announcement.update(updateParam, {where: { id: id }}).then(data => {
        if(data){
            let activateString = param.isActive ? 'active' : 'inactive';
            console.log("Change status of announcement with id: '"+ param.id +"' in database to '"+ activateString +"'.");
            return data;
        } else {
            console.log("Could not change status of announcement with id: '"+ param.id +"' in database.");
            return 'Status not changed';
        }
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Status not changed';
    });
};

/**
 * Delete a announcement from the db by the id of the announcement
 * @param param Json object containing the id of the announcement that should be deleted
 */
exports.delete = (param) => {
    console.log("Delete an existent announcement!");

    const uid = param.uid;
    return Announcement.destroy({ where: { uid: uid }}).then(data => {
        if(data){
            console.log("Deleted announcement with id: '"+ param.id +"' in database.");
            return data;
        } else {
            console.log("Could not delete announcement with id: '"+ param.id +"' in database.");
            return 'Not deleted';
        }
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Not deleted';
    });
};


