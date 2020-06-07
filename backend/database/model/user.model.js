module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        uid: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        gender: {
            type: Sequelize.INTEGER
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        nickName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        birthDate: {
            type: Sequelize.DATE
        },
        streetAddress: {
            type: Sequelize.STRING
        },
        zipCode: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING,
            defaultValue: 'Smart City'
        },
        phone: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.TEXT
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        role: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
    });

    return User;
};
