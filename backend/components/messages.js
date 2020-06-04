const config = require("./config.js");
const amqp = require('amqplib/callback_api');
let pubChannel = null;

function createChannel(){
    //create connection
    amqp.connect('amqp://localhost', (err, con) => {
        if(err){
            throw err;
        }

        //create channel
        con.createChannel((chErr, channel) => {
            if(chErr){
                throw chErr;
            }

            pubChannel = channel;

            //assert the queue
            channel.assertQueue(config.MESSAGE_QUEUE);

            channel.consume(config.MESSAGE_QUEUE, msg => {
                console.log("received: " + message);
            })
        })
    });
}

module.exports = createChannel;