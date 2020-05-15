module.exports = function (app, express) {
    const users = require("../database/controller/user.controller");
    let router = express.Router();

    /**
     * Route to create a new user
     */
    router.post("/", users.create);

    /**
     * Route to retrieve a user by uid
     */
    router.get("/:id", users.findOne);

    /**
     * Route to retrieve all users
     */
    router.get("/", users.findAll);

    /**
     * Route to retrieve all users
     */
    router.get("/active", users.findAllActive);

    /**
     * Route to update a user
     */
    router.put("/:id", users.update);

    /**
     * Route to delete a user by uid
     */
    router.delete("/:id", users.delete);

    app.use('/api/users', router);
};
