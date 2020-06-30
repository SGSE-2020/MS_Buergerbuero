const rb = require('../../components/responseBuilder');
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
        console.error("DB ERROR: " + err);
        return 'Not created';
    });
};

/**
 * Get all users from db
 * @returns user list
 */
exports.getAllUsers = (req, res) => {
    console.log("REST CALL: get -> user");
    let responseObj = {};

    return User.findAll().then(data => {
        if(data){
            responseObj = rb.success("Users", "found", { users: data });
        } else {
            responseObj = rb.failure("users", "finding");
        }
        res.send(responseObj);
    }).catch(err => {
        responseObj = rb.error(err);
        res.send(responseObj);
    });
};

/**
 * Find a user by uid
 * @param param Json object containing a uid of user to search in the database
 * @returns User object
 */
exports.findOne = (req, res) => {
    console.log("REST CALL: get -> /user/:uid");
    let responseObj = {};
    return User.findByPk(req.params.uid).then(data => {
        if(data){
            responseObj = rb.success("User", "found", data);
        } else {
            responseObj = rb.failure("user", "finding");
        }
        res.send(responseObj);
    }).catch(err => {
        responseObj = rb.error(err);
        res.send(responseObj);
    });
};

/**
* Find a user by uid without rest call
* @param param Json object containing a uid of user to search in the database
* @returns User object
*/
exports.findOneManually = async (param) => {
    const uid = param.uid;
    return User.findByPk(uid).then(data => {
        if(data){
            return data;
        } else {
            return 'Not found';
        }
    }).catch(err => {
        console.error("DB ERROR: " + err);
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
        console.error("DB ERROR: " + err);
        return 'Not updated';
    });
};

/**
 * Update an image of an user in the database
 * @param Uid Uid of the user in the database
 * @param body.image Json object containing the image that should be updated
 */
exports.updateImageFromUser = (uid, updateObj) => {
    return User.update(updateObj, {where: { uid: uid }}).then(data => {
        if(data){
            return data;
        } else {
            return 'Not updated';
        }
    }).catch(err => {
        console.error("DB ERROR: " + err);
        return 'Not updated';
    });
};

/**
 * Delete an image from an user in the database
 * @param Uid Uid from the user in the database
 */
exports.deleteImageFromUser = (uid) => {
    let updateObj = {
        image: null
    };

    return User.update(updateObj, {where: { uid: uid }}).then(data => {
        if(data){
            return data;
        } else {
            return 'Not updated';
        }
    }).catch(err => {
        console.error("DB ERROR: " + err);
        return 'Not updated';
    });
};

/**
 * Update user role from given user
 * @param Uid Uid of the user in the database
 * @param body.role New user role
 */
exports.updateUserRole = (req, res) => {
    console.log("REST CALL: put -> /user/role/:uid");

    let responseObj = {};
    return User.update(req.body, {where: { uid: req.params.uid }}).then(data => {
        if(data){
            responseObj = rb.success("Role", "updated");
        } else {
            responseObj = rb.failure("role", "updating");
        }
        res.send(responseObj);
    }).catch(err => {
        responseObj = rb.error(err);
        res.send(responseObj);
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
        console.error("DB ERROR: " + err);
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
        console.error("DB ERROR: " + err);
        return 'Not deleted';
    });
};


