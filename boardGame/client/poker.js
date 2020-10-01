var wsUri = "ws://ec2-35-165-46-164.us-west-2.compute.amazonaws.com:3000";
var output;

var socket = io(wsUri);

socket.on("hello",(data) => {console.log(data);});