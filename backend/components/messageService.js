const amqp = require('amqp');
let exchange = null;

exports.initialize = () => {
    const connection = amqp.createConnection({
        host: 'ms-rabbitmq',
        port: 5672,
        login: 'testmanager',
        password: 'sgseistgeil',
        vhost: '/'
    });

    connection.on('ready', () => {
        console.log("AMQP connection established.");
        connection.exchange(process.env.MESSAGE_EXCHANGE, {
            type: process.env.MESSAGE_EXCHANGE_TYPE
        }, (exchangeRes) => {
            console.log("AMQP exchange established.");
            exchange = exchangeRes;
            /*
            exchange.queue('', queue => {
               queue.bind(process.env.MESSAGE_EXCHANGE, process.env.QUEUE_USER_CHANGED);
               queue.subscribe(msg => {
                   console.log("AMQP - Consumed message: " + msg.content );
                   //console.log(JSON.parse(msg.content));
                   //console.log(msg.fields);
                   //console.log(msg.properties);
               });
            });*/
        });
    });

    connection.on('error', error => {
        console.error("AMQP Connection error: " + error.message);
    })
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





