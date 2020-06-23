const amqp = require('amqplib/callback_api');
const messageURL = 'amqp://testmanager:sgseistgeil@ms-rabbitmq/vhost';
//const messageURL = 'amqp://localhost';
//const messageURL = 'amqp://rabbitmq.dvess.network/';

let pubChannel = null;
let consumeChannel = null;

exports.startPublisher = () => {
    amqp.connect(messageURL, function (conErr, con) {
        if(conErr){
            console.error("AMQP ERROR: " + conErr.message);
        } else {
            con.createChannel(function (chErr, channel) {
                if(chErr){
                    console.error("AMQP ERROR: " + chErr.message);
                } else {
                    pubChannel = channel;
                    console.log("Initialized AMQP publisher channel");
                }
            });
        }
    });
};;

exports.startConsumer = () => {
    amqp.connect(messageURL, function (conErr, con) {
        if (conErr) {
            console.error("AMQP ERROR: " + conErr.message);
        } else {
            con.createChannel(function (chErr, channel) {
                if(chErr){
                    console.error("AMQP ERROR: " + chErr.message);
                } else {
                    consumeChannel = channel;
                    console.log("Initialized AMQP consumer channel");
                    channel.assertExchange(process.env.MESSAGE_EXCHANGE, process.env.MESSAGE_EXCHANGE_TYPE, {
                        durable: false
                    });

                    channel.assertQueue('', {
                        exclusive: true
                    }, function (queueErr, queue) {
                        if (queueErr) {
                            console.error("AMQP ERROR: " + queueErr.message);
                        };
                        // todo bind all queues
                        //channel.bindQueue(queue.queue, process.env.MESSAGE_EXCHANGE, process.env.QUEUE_USER_CHANGED);

                        /*
                        channel.consume(queue.queue, function (msg) {
                            console.log("Consume object");
                            //console.log(JSON.parse(msg.content));
                            //console.log(msg.fields);
                            //console.log(msg.properties);
                            // todo trigger functions based on msg.properties.type
                        }, {
                            noAck: true
                        });
                        */

                    });
                }
            });
        }
    });
};

exports.publishToExchange = (routingKey, data) => {
    pubChannel.assertExchange(process.env.MESSAGE_EXCHANGE, process.env.MESSAGE_EXCHANGE_TYPE, {
        durable: false
    });
    pubChannel.publish(process.env.MESSAGE_EXCHANGE, routingKey, Buffer.from(JSON.stringify(data)), {
        appId: 'Bürgerbüro',
        timestamp: new Date().getTime(),
        contentType: 'application/json',
        type: routingKey
    }).then(() => {
        console.log("AMQP - Published message: " + JSON.stringify(data));
    }).catch(err => {
        console.log("AMQP - ERROR on publishing message: " + err.message);
    });
};

process.on('exit', (code) => {
    if(pubChannel != null){
        pubChannel.close();
    }

    if(consumeChannel != null){
        consumeChannel.close();
    }
    console.log('Shutting down rabbitmq publish channel');
});




