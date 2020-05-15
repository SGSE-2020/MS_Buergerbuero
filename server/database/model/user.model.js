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
            type: Sequelize.STRING,
            defaultValue: 'Anonym'
        },
        email: {
            type: Sequelize.STRING
        },
        birthDate: {
            type: Sequelize.DATE
        },
        streetAdress: {
            type: Sequelize.STRING
        },
        zipcode: {
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
            type: Sequelize.STRING
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    return User;
};
