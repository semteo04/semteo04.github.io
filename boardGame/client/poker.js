let wsUri = "wss://ec2-35-165-46-164.us-west-2.compute.amazonaws.com:3000";
//let wsUri = "ws://localhost:3000";
let output;

let socket = io(wsUri,{secure: true});
socket.on("hello",(data) => {console.log(data);});
socket.on("chat",(data) => {
    $('#chatting').append(`<li>${data}</li>`);
});

function send(){
    let chat = document.getElementById("chat").value;
    socket.emit("chat",chat);
    console.log(chat);
}