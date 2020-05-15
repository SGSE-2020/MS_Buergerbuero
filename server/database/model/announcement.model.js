module.exports = (sequelize, Sequelize) => {
    const Announcement = sequelize.define("announcement", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING
        },
        text: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        },
        source: {
            type: Sequelize.STRING
        },
        service: {
            type: Sequelize.STRING
        },
        uid: {
            type: Sequelize.STRING,
        },
        isactive: {
            type: Sequelize.BOOLEAN_TYPE,
            defaultValue: false
        }
    });

    return Announcement;
};
