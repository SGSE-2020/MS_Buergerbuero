const db = require("../../components/database");
const User = db.users;

/**
 * Create User in the database
 * @param param Json object containing a user within the database
 */
exports.create = (param) => {
    return User.create(param).then(data => {
        if(data){
            return data;
        } else {
            return 'Not created';
        }
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Not created';
    });
};

/**
 * Find a user by uid
 * @param param Json object containing a uid of user to search in the database
 * @returns User object
 */
exports.findOne = (param) => {
    const uid = param.uid;
    return User.findByPk(uid).then(data => {
        if(data){
            return data;
        } else {
            return 'Not found';
        }
        return data;
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Not found';
    });
};

/**
 * Update a user within the database
 * @param param Json object containing the user that should be updated in database
 */
exports.update = (param) => {
    const uid = param.uid;
    return User.update(param, {where: { uid: uid }}).then(data => {
        if(data){
            return data;
        } else {
            return 'Not updated';
        }
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Not updated';
    });
};

/**
 * Deactivate a user from the db by the uid of the user
 * @param param Json object containing the uid of the user that should be deactivated
 */
exports.deactivate = (param) => {
    const uid = param.uid;
    const updateParam = {
        isActive: false
    }

    return User.update(updateParam, {where: { uid: uid }}).then(data => {
        if(data){
            return data;
        } else {
            return 'Not deactivated';
        }
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Not deactivated';
    });
};

/**
 * Delete a user from the db by the uid of the user
 * @param param Json object containing the uid of the user that should be deleted
 */
exports.delete = (param) => {
    const uid = param.uid;
    return User.destroy({ where: { uid: uid }}).then(data => {
        if(data){
            return data;
        } else {
            return 'Not deleted';
        }
    }).catch(err => {
        console.log('ERROR');
        console.log(err);
        return 'Not deleted';
    });
};


