const mysql = require('mysql');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
var io = require('socket.io').listen(server);
io.on('connection', (socket) => {
    io.emit('userName', { type: 'userName', text: `User ${userCount}` });

    socket.on('login', (userName) => {
        connection.query(`INSERT INTO userInfo (userid, time) VALUES ("${userName}", "${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}");`);
    });
});

server.listen(3000, () => {
    console.log("start");
})

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Qwrtjrwnsdl!2',
    database: 'boardgame',
    port: '3307'
})

connection.connect();
/*
connection.query(`CREATE TABLE userInfo (
    userId VARCHAR(30) NOT NULL,
    time DATETIME NOT NULL,
     PRIMARY KEY(userId)
   );`);

connection.query(`CREATE TABLE bonanja (
    userId VARCHAR(30) NOT NULL,
    win INT(11) NOT NULL,
    lose INT(11) NOT NULL,
     PRIMARY KEY(userId)
   );`);
   */