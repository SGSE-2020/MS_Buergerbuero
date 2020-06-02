const rb = require('../../components/response_builder');
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
        return 'Not created';
    });
};

/**
 * Find a user by uid
 * @param param Json object containing a uid of user to search in the database
 * @returns User object
 */
exports.findOne = (req, res) => {
    console.log("REST CALL: /user/:uid");
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
        return 'Not updated';
    });
};

/**
 * Update an image of an user in the database
 * @param Uid Uid of the user in the database
 * @param body.image Json object containing the image that should be updated
 */
exports.updateImageFromUser = (req, res) => {
    console.log("REST CALL: /user/image/:uid");

    let responseObj = {};
    return User.update(req.body, {where: { uid: req.params.uid }}).then(data => {
        if(data){
            responseObj = rb.success("Image", "updated");
        } else {
            responseObj = rb.failure("image", "updating");
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
        return 'Not deleted';
    });
};


