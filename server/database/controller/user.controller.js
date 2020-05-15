const db = require("../../components/database");
const User = db.users;
const Op = db.Sequelize.Op;

/**
 * Create User in the database
 */
exports.create = (req, res) => {
    User.create(req.user).then(data => {
            console.log(data);
            res.send(data);
    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the User."
            });
        });
};

/**
 * Find a user by uid
 */
exports.findOne = (req, res) => {
    const id = req.params.uid;
    User.findByPk(id).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: "Error retrieving Tutorial with id=" + id
        });
    });
};

/**
 * Retrieve all users in database
 */
exports.findAll = (req, res) => {
    User.findAll().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tutorials."
        });
    });
};

/**
 * Retrieve all active users
 */
exports.findAllActive = (req, res) => {
    User.findAll({ where: { isActive: true } }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tutorials."
        });
    });
};

/**
 * Update a user by the uid of user
 */
exports.update = (req, res) => {
    const id = req.params.uid;

    User.update(req.body, {
        where: { uid: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "Tutorial was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating Tutorial with id=" + id
        });
    });
};

/**
 * Delete a user from the db by the uid
 */
exports.delete = (req, res) => {
    const id = req.params.uid;

    User.destroy({
        where: { uid: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "Tutorial was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Could not delete Tutorial with id=" + id
        });
    });
};


