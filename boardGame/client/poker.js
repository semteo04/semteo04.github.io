var wsUri = "ws://ec2-35-165-46-164.us-west-2.compute.amazonaws.com:3000";
var output;
init();
function init() {
    testWebSocket();
}

function testWebSocket(){
    websocket = new WebSocket(wsUri);
    console.log("~~",websocket);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt){
    console.log("hello");
}

function onClose(evt){
}

function onMessage(evt){
    console.log("~~",evt);
}

function onError(evt){
}

function doSend(message){
}

function writeToScreen(message){
}