const config = require("./config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../database/model/user.model")(sequelize, Sequelize);
db.announcements = require("../database/model/announcement.model")(sequelize, Sequelize);

module.exports = db;
