const userCtrl = require("./controller/user.controller");

/**
 * Create initial firebase user accounts if not exists and add admin role
 * @param firebase Firebase auth object
 */
exports.createFirebaseUserAccounts = (firebase) => {
    console.log("Initial creating of firebase user accounts in database.")
    firebase.auth().listUsers().then(result => {
        if(result.users != undefined && result.users.length > 0){
            result.users.forEach(function (value){
                const user = {
                    uid: value.uid,
                    gender: 1,
                    firstName: "Anonym",
                    lastName: "Anonym",
                    nickName: value.displayName,
                    email: value.email,
                    birthDate: "01.01.1900",
                    streetAddress: "Beispielstraße",
                    zipCode: "12345",
                    role: 1,
                    isActive: true
                }

                if(user.uid === "rk9WQRry1LYOLkqBAGZg8K36Mco2"){
                    user.role = 3;
                }
                userCtrl.create(user).then(databaseResult => {
                    if(databaseResult !== "Not created"){
                        console.log("Initial created user with id: " + value.uid + ".");
                    } else {
                        console.error("Error on creating user with id: " + value.uid + ".");
                    }
                });
            })
        }
    });
};





