var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var player=[],count=0;
app.get('/',function(req, res){
	res.sendFile(__dirname + '/isac.html');
});
class Isac{
	constructor(){
		this.x=Math.floor(Math.random()*400)+10;
		this.y=Math.floor(Math.random()*400)+10;
		this.dx=0;
		this.dy=0;
		this.speedMax=2;
		this.shotSpeed=2;
		this.tearDelay=30;
		this.tearDelayNow=30;
		this.hp=100;
		this.power=3;
	}
}
class Tear{
	constructor(x,y,dx,dy,p){
		this.x=x;
		this.y=y;
		this.dx=dx;
		this.dy=dy;
		this.p=p;
		this.speedMax=isac[p].shotSpeed;
		this.damage=isac[p].power;
	}
}
var isac=new Array(200);
var tear=new Array(10000),tearCnt=0;

io.on('connection', function(socket){
	count++;
	player[count]=socket.id;
	isac[count]=new Isac();
	io.to(socket.id).emit("my number",count);
	socket.on('keyboard',function(kb,num){
		if(player[num]!=socket.id) return;
		if(kb[65]==1) isac[num].dx-=1;
		if(kb[68]==1) isac[num].dx+=1;
		if(kb[83]==1) isac[num].dy+=1;
		if(kb[87]==1) isac[num].dy-=1;
		if(isac[num].tearDelayNow==isac[num].tearDelay){
			if(kb[37]==1) {
				tearCnt++;
				tear[tearCnt]=new Tear(isac[num].x,isac[num].y,isac[num].dx*0.1-isac[num].shotSpeed,isac[num].dy*0.1,num);
				isac[num].tearDelayNow=0;
			}
			if(kb[38]==1) {
				tearCnt++;
				tear[tearCnt]=new Tear(isac[num].x,isac[num].y,isac[num].dx*0.1,isac[num].dy*0.1-isac[num].shotSpeed,num);
				isac[num].tearDelayNow=0;
			}
			if(kb[39]==1) {
				tearCnt++;
				tear[tearCnt]=new Tear(isac[num].x,isac[num].y,isac[num].dx*0.1+isac[num].shotSpeed,isac[num].dy*0.1,num);
				isac[num].tearDelayNow=0;
			}
			if(kb[40]==1) {
				tearCnt++;
				tear[tearCnt]=new Tear(isac[num].x,isac[num].y,isac[num].dx*0.1,isac[num].dy*0.1+isac[num].shotSpeed,num);
				isac[num].tearDelayNow=0;
			}
		}
		else isac[num].tearDelayNow++;
		if(isac[num].tearDelayNow>isac[num].tearDelay) isac[num].tearDelayNow=isac[num].tearDelay;
		io.to(player[num]).emit('position',isac,count,tear,tearCnt,isac[num].hp);
	});
	socket.on('disconnect', function() {
      	for(var i=1;i<=count;i++){
      		if(player[i]==socket.id){
      			isac[i].x=-100;
      			isac[i].y=-100;
      			break;
      		}
      	}
   });
});
http.listen(3000, function(){ //4
	console.log('server on!');
});
function ptdist(x,y){
	var x1=isac[x].x,y1=isac[x].y;
	var x2=tear[y].x,y2=tear[y].y;
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}
function tearDie(i){
	tear[i].x=-100;
	tear[i].y=-100;
}
function move(){
	var i;
	for(i=1;i<=count;i++){
		if(isac[i].dx>isac[i].speedMax) isac[i].dx=isac[i].speedMax;
		if(isac[i].dx<-isac[i].speedMax) isac[i].dx=-isac[i].speedMax;
		if(isac[i].dy>isac[i].speedMax) isac[i].dy=isac[i].speedMax;
		if(isac[i].dy<-isac[i].speedMax) isac[i].dy=-isac[i].speedMax;
		isac[i].x+=isac[i].dx;
		isac[i].y+=isac[i].dy;
		if(isac[i].dx>0.5) isac[i].dx-=0.2;
		else if(isac[i].dx<-0.2) isac[i].dx+=0.2;
		else isac[i].dx=0;
		if(isac[i].dy>0.5) isac[i].dy-=0.2;
		else if(isac[i].dy<-0.2) isac[i].dy+=0.2;
		else isac[i].dy=0;
	}
	var t=1;
	for(i=1;i<=tearCnt;i++){
		tear[i].x+=tear[i].dx;
		tear[i].y+=tear[i].dy;
		tear[t]=tear[i];
		if(!(tear[i].x<0 || tear[i].y<0 || tear[i].x>2000 || tear[i].y>2000)) t++;
	}
	for(i=1;i<=tearCnt;i++){
		for(j=1;j<=count;j++){
			if(j==tear[i].p) continue;
			if(ptdist(j,i)<=10) {
				tearDie(i);
				isac[j].hp-=tear[i].damage;
				if(isac[j].hp<0) console.log(`${j} die!!`);
				break;
			}
		}
	}
	tearCnt=t-1;
}
setInterval(function(){
	move()
},1000/60);