const amqp = require('amqp');
let publishExchange = null;

exports.initializePublisher = () => {
    const connection = amqp.createConnection({
        host: 'ms-rabbitmq',
        port: 5672,
        login: 'testmanager',
        password: 'sgseistgeil',
        vhost: '/'
    });

    connection.on('ready', () => {
        console.log("AMQP connection established.");
        publishExchange = connection.exchange(process.env.MESSAGE_EXCHANGE, {
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





