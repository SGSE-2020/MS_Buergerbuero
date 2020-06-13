module.exports = (sequelize, Sequelize) => {
    const Announcement = sequelize.define("announcement", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        text: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        image: {
            type: Sequelize.TEXT
        },
        source: {
            type: Sequelize.STRING,
            allowNull: false
        },
        service: {
            type: Sequelize.STRING
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    return Announcement;
};
