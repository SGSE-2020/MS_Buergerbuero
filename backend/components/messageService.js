const amqp = require('amqp');
const userCtrl = require("../database/controller/user.controller");
let publishExchange = null;

const connectionObj = {
    host: 'ms-rabbitmq',
    port: 5672,
    login: 'testmanager',
    password: 'sgseistgeil',
    vhost: '/'
};

const firebase = require("firebase-admin");

exports.initializePublisher = () => {
    const connection = amqp.createConnection(connectionObj);

    connection.on('ready', () => {
        console.log("AMQP connection for publisher established.");

        publishExchange = connection.exchange(process.env.PUBLISH_EXCHANGE, {
            type: process.env.MESSAGE_EXCHANGE_TYPE,
            durable: true,
            autoDelete: false
        }, (exchangeRes) => {
            console.log("AMQP exchange '" + exchangeRes.name + "' established.");
        });

        publishExchange.on('error', error => {
            console.error("AMQP Exchange error: " + error.message);
        });
    });

    connection.on('error', error => {
        console.error("AMQP Connection error: " + error.message);
    })
};

exports.initializeConsumer = () => {
    const connection = amqp.createConnection(connectionObj);

    connection.on('ready', () => {
        console.log("AMQP connection for consumer established.");
        connection.exchange(process.env.CONSUME_EXCHANGE, {
            type: process.env.MESSAGE_EXCHANGE_TYPE,
            durable: true,
            autoDelete: false
        }, (exchangeRes) => {
            console.log("AMQP exchange '" + exchangeRes.name + "' established.");

            connection.queue('buergerbuero_nutzerVerstorben', queue => {
                console.log("AMQP queue '" + queue.name + "' is open.");

                queue.bind(process.env.CONSUME_EXCHANGE, process.env.QUEUE_USER_DEAD, callback => {
                    console.log("AMQP queue '" + queue.name + "' is bound to exchange: " + exchangeRes.name + ".");
                });

                queue.subscribe((msg) => {
                    console.log("AMQP: Consume message: " + JSON.stringify(msg));
                    if(msg !== undefined){
                        firebase.auth().updateUser(msg.patientID, {
                            disabled: true
                        }).then(function(userRecord) {
                            if(userRecord.disabled === true){
                                userCtrl.deactivate({uid: msg.patientID}).then(dbResult => {
                                    if(dbResult !== "Not deactivated") {
                                        console.log("Deactivated User with id: " + msg.patientID);
                                        const data = {
                                            uid: msg.patientID,
                                            message: 'User was deactivated.'
                                        };
                                        publishToExchange(process.env.QUEUE_USER_DEACTIVATE, data);
                                    } else {
                                        console.error("ERROR: Cannot deactivate user in database");
                                    }
                                });
                            } else {
                                console.error("ERROR: Cannot deactivate user in firebase");
                            }
                        }).catch(function(err) {
                            console.error("ERROR: " + err.message);
                        });
                    } else {
                        console.error("AMQP: Message malformed");
                    }
                });
            });
        });

        publishExchange.on('error', error => {
            console.error("AMQP Exchange error: " + error.message);
        });
    });

    connection.on('error', error => {
        console.error("AMQP Connection error: " + error.message);
    })
};

exports.publishToExchange = (routingKey, data) => {
    if(publishExchange != null){
        console.log("AMQP - Start publishing");
        publishExchange.publish(routingKey, Buffer.from(JSON.stringify(data)), {
            appId: 'Bürgerbüro',
            timestamp: new Date().getTime(),
            contentType: 'application/json',
            type: routingKey
        }, () => {
            console.log("AMQP - Published message: " + JSON.stringify(data));
        });

        publishExchange.on('error', error => {
            console.error("AMQP Exchange error: " + error.message);
        });
    } else {
        console.error("AMQP - Can not publish");
    }
};





