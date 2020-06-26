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
        exchange = connection.exchange(process.env.MESSAGE_EXCHANGE, {
            type: process.env.MESSAGE_EXCHANGE_TYPE,
            durable: true,
            autoDelete: false
        }, (exchangeRes) => {
            console.log("AMQP exchange " + exchangeRes.name + " established.");
            /*
            exchange.queue('', queue => {
               queue.bind(process.env.MESSAGE_EXCHANGE, process.env.QUEUE_USER_CHANGED);
               queue.subscribe(msg => {
                   console.log("AMQP - Consumed message: " + msg.content );
                   //console.log(JSON.parse(msg.content));
                   //console.log(msg.fields);
                   //console.log(msg.properties);
               });
            });
            */
        });

        exchange.on('error', error => {
            console.error("AMQP Exchange error: " + error.message);
        });
    });

    connection.on('error', error => {
        console.error("AMQP Connection error: " + error.message);
    })
};

exports.publishToExchange = (routingKey, data) => {
    if(exchange != null){
        console.log("AMQP - Start publishing");
        console.log(exchange);
        exchange.publish(routingKey, Buffer.from(JSON.stringify(data)), {
            appId: 'Bürgerbüro',
            timestamp: new Date().getTime(),
            contentType: 'application/json',
            type: routingKey
        }, res => {
            if(res == true){
                console.log("AMQP - Published message: " + JSON.stringify(data));
            } else {
                console.error("AMQP - Could not publish message");
            }
        });

        exchange.on('error', error => {
            console.error("AMQP Exchange error: " + error.message);
        });
    } else {
        console.error("AMQP - Can not publish");
    }
};





