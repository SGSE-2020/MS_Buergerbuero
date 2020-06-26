const amqp = require('amqp');
const messageURL = 'amqp://testmanager:sgseistgeil@ms-rabbitmq:5672/';
const connection = amqp.createConnection(messageURL);
let exchange = null;


exports.initialize = () => {
    connection.on('ready', () => {
        exchange = connection.exchange(process.env.MESSAGE_EXCHANGE, {
            type: process.env.MESSAGE_EXCHANGE_TYPE
        }, () => {
            console.log("Initialized AMQP exchange");
        });
    });
};

exports.publishToExchange = (routingKey, data) => {
    if(exchange != null){
        console.log("AMQP - Start publishing");
        exchange.on('open', () => {
            console.log("AMQP - Exchange is open - publishing message");
            exchange.publish(routingKey, Buffer.from(JSON.stringify(data)), {
                appId: 'Bürgerbüro',
                timestamp: new Date().getTime(),
                contentType: 'application/json',
                type: routingKey
            }).then(() => {
                console.log("AMQP - Published message: " + JSON.stringify(data));
            }).catch(err => {
                console.error("AMQP - ERROR on publishing message: " + err.message);
            });
        });
    } else {
        console.error("AMQP - Can not publish");
    }
};





