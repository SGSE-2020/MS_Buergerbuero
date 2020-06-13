module.exports = (sequelize, Sequelize) => {
    const AnnouncementVerification = sequelize.define("announcement_verification", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        key1: {
            type: Sequelize.STRING,
            allowNull: false
        },
        key2: {
            type: Sequelize.STRING,
            allowNull: false
        },
        key3: {
            type: Sequelize.STRING,
            allowNull: false
        },
        value1: {
            type: Sequelize.STRING,
            allowNull: false
        },
        value2: {
            type: Sequelize.STRING,
            allowNull: false
        },
        value3: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return AnnouncementVerification;
};
