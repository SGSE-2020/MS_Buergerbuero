module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        uid: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        gender: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nickName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        birthDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        streetAddress: {
            type: Sequelize.STRING,
            allowNull: false
        },
        zipCode: {
            type: Sequelize.STRING,
            allowNull: false
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
