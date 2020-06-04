module.exports = (sequelize, Sequelize) => {
    const AnnouncementVerification = sequelize.define("announcement_verification", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        aid: {
            type: Sequelize.INTEGER,
            references: {
                model: "announcements",
                key: "id"
            }
        },
        key1: {
            type: Sequelize.STRING
        },
        key2: {
            type: Sequelize.STRING
        },
        key3: {
            type: Sequelize.STRING
        },
        value1: {
            type: Sequelize.STRING
        },
        value2: {
            type: Sequelize.STRING
        },
        value3: {
            type: Sequelize.STRING
        }
    });

    return AnnouncementVerification;
};
