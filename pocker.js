var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req, res){
	res.sendFile(__dirname + '/indian.html');
});

var count=0;
var player=[];
var card1=0,card2=0,chip1=30,chip2=30;
var bat1,bat2;
var turn=1;
function turnn(){
  if(turn==1){
      io.to(player[1]).emit('turn',1);
      io.to(player[2]).emit('turn',-1);
  }
  else{
      io.to(player[1]).emit('turn',-1);
      io.to(player[2]).emit('turn',1);
  }
}
function gameSet(){
  bat1=1; bat2=1;
  card1=Math.floor(Math.random()*10)+1;
  card2=Math.floor(Math.random()*10)+1;
  io.to(player[1]).emit('your card',card2);
  io.to(player[2]).emit('your card',card1);
  io.to(player[1]).emit('my chip',chip1);
  io.to(player[2]).emit('my chip',chip2);
  io.to(player[1]).emit('your chip',chip2);
  io.to(player[2]).emit('your chip',chip1);
  io.to(player[1]).emit('my bat',bat1);
  io.to(player[2]).emit('my bat',bat2);
  io.to(player[1]).emit('your bat',bat2);
  io.to(player[2]).emit('your bat',bat1);
  turnn();
}
function judge(win){
  if(win==0){
    bat1=1; bat2=1;
  }
  else if(win==1){
    if(card2==10) bat2+=10;
    chip1+=bat2;
    chip2-=bat2;
    turn=win;
  }
  else{
    if(card1==10) bat1+=10;
    chip2+=bat1;
    chip1-=bat1;
    turn=win;
  }
  gameSet();
}
function go(){
  if(card1<card2) judge(2);
  else if(card1>card2) judge(1);
  else judge(0);
}
io.on('connection', function(socket){
	count++;
  player[count]=socket.id;
  io.to(socket.id).emit("my num",count);
  if(count==2){
      io.emit('game start');
      chip1=100;
      chip2=100;
      gameSet();
  }
  console.log('user connected: ', socket.id);
  console.log(count);
  socket.on('bat', function(num,val){
    val=Number(val);
    if(num==turn){
      if(val==-1){
        judge(3-num);
      }
      if(num==1 && val<bat1 || num==2 && val<bat2) return;
      if(num==1 && val<bat2 || num==2 && val<bat1) return;
      if(num==1 && val>chip2 || num==2 && val>chip1) return;
      if(num==1 && val==bat2 || num==2 && val==bat1){
        bat1=val;
        bat2=val;
        go();
        return;
      }
      if(num==1) bat1=Number(val);
      if(num==2) bat2=Number(val);
      if(num==1){
        io.to(player[1]).emit('my bat',bat1);
        io.to(player[2]).emit('your bat',bat1);
      }
      else{
        io.to(player[1]).emit('your bat',bat2);
        io.to(player[2]).emit('my bat',bat2);
      }
      turn=3-turn;
      turnn();
      console.log(card1,card2,bat1,bat2);
    }
  });
  	/*
  	io.to(socket.id).emit('change name',name);

  	socket.on('disconnect', function(){
  		console.log('user disconnected: ', socket.id);
  	});

  	socket.on('send message', function(name,text){ //3-3
  		var msg = name + ' : ' + text;
  		console.log(msg);
  		io.emit('receive message', msg);
  	});
  	*/
  });

http.listen(3000, function(){ //4
	console.log('server on!');
});
