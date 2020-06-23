const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../database/model/user.model")(sequelize, Sequelize);
db.announcements = require("../database/model/announcement.model")(sequelize, Sequelize);
db.announcement_verification = require("../database/model/announcement_verification.model")(sequelize, Sequelize);

db.announcements.belongsTo(db.users, {foreignKey: 'uid', allowNull: true});
db.announcements.hasOne(db.announcement_verification, {foreignKey: 'aid', onDelete: 'CASCADE'});

module.exports = db;
