const path = require('path');
const caller = require('grpc-caller')
const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
const client = caller('127.0.0.1:50051', userProtoPath, 'UserService');

let paramVerify = {};
paramVerify.token = "ExampleUserToken";
console.log("Example call of 'verifyUser':");
client.verifyUser(paramVerify).then(function(res){
    console.log("Return: " + JSON.stringify(res));
});
