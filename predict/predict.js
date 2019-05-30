var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");
var multer = require("multer");

app.get("/", function(req, res) {
	fs.readdir("./", function(error, filelist) {
		console.log(filelist);
	});
	console.log(__dirname);
	res.sendFile(__dirname + "/predict.html");
});
function inputFile(x, y, z) {
	app.get(`/${x}`, function(req, res) {
		fs.readFile(`./${x}.${z}`, function(error, data) {
			res.writeHead(200, { "content-Type": y });
			res.end(data);
		});
	});
}
app.get("/css", function(req, res) {
	fs.readFile("./predictButtonCss.css", function(error, data) {
		res.writeHead(200, { "content-Type": "text/css" });
		res.end(data);
	});
});
inputFile("predictMpaint", "text/html", "js");
inputFile("predictPhoneW", "image/png", "png");
inputFile("predictPhoneB", "image/png", "png");
inputFile("predictBishopW", "image/png", "png");
inputFile("predictBishopB", "image/png", "png");
inputFile("predictRookW", "image/png", "png");
inputFile("predictRookB", "image/png", "png");
inputFile("predictKnightW", "image/png", "png");
inputFile("predictKnightB", "image/png", "png");
inputFile("predictQueenW", "image/png", "png");
inputFile("predictQueenB", "image/png", "png");
inputFile("predictKingW", "image/png", "png");
inputFile("predictKingB", "image/png", "png");
function alpha(x) {
	if (
		x == "a" ||
		x == "b" ||
		x == "c" ||
		x == "d" ||
		x == "e" ||
		x == "f" ||
		x == "g" ||
		x == "h"
	)
		return true;
	if (
		x == "A" ||
		x == "B" ||
		x == "C" ||
		x == "D" ||
		x == "E" ||
		x == "F" ||
		x == "G" ||
		x == "H"
	)
		return true;
	return false;
}
function numb(x) {
	if (
		x == "1" ||
		x == "2" ||
		x == "3" ||
		x == "4" ||
		x == "5" ||
		x == "6" ||
		x == "7" ||
		x == "8"
	)
		return true;
	return false;
}
function matchStat(x, y) {
	if (y == 1 || y == 8) stat[x][y] = 2;
	if (y == 2 || y == 7) stat[x][y] = 3;
	if (y == 3 || y == 6) stat[x][y] = 4;
	if (y == 4) stat[x][y] = 5;
	if (y == 5) stat[x][y] = 6;
	if (x > 4) stat[x][y] *= -1;
}
var map = new Array(9);
for (i = 0; i < 9; i++) map[i] = new Array(9);
var stat = new Array(9);
for (i = 0; i < 9; i++) stat[i] = new Array(9);
var count = 0,
	player = new Array(10),
	turn = 1,
	judge = 0,
	rock = 0,
	move = new Array(32);
function enemy(x, y) {
	if (x == 0 || y == 0) return 0;
	if (x <= 16 && y > 16) return 1;
	if (x > 16 && y <= 16) return 1;
	return -1;
}
function ten(x1, y1, x2, y2, st) {
	var i;
	for (i = x1 + 1; i < 8; i++) {
		if (enemy(map[i][y1], st) == -1) break;
		if (i == x2 && y1 == y2) judge = 1;
		if (enemy(map[i][y1], st) == 1) break;
	}
	for (i = x1 - 1; i >= 0; i--) {
		if (enemy(map[i][y1], st) == -1) break;
		if (i == x2 && y1 == y2) judge = 1;
		if (enemy(map[i][y1], st) == 1) break;
	}
	for (i = y1 + 1; i < 8; i++) {
		if (enemy(map[x1][i], st) == -1) break;
		if (x1 == x2 && i == y2) judge = 1;
		if (enemy(map[x1][i], st) == 1) break;
	}
	for (i = y1 - 1; i >= 0; i--) {
		if (enemy(map[x1][i], st) == -1) break;
		if (x1 == x2 && i == y2) judge = 1;
		if (enemy(map[x1][i], st) == 1) break;
	}
}
function hourse(x1, y1, x2, y2, st) {
	var a = [0, 1, 2, 2, 1, -1, -2, -2, -1],
		b = [0, 2, 1, -1, -2, -2, -1, 1, 2],
		i;
	for (i = 1; i <= 8; i++) {
		var sx = x1 + a[i],
			sy = y1 + b[i];
		if (
			sx == x2 &&
			sy == y2 &&
			(enemy(map[x2][y2], st) == 1 || enemy(map[x2][y2], st) == 0)
		)
			judge = 1;
	}
}
function king(x1, y1, x2, y2, st) {
	var a = [0, 1, 1, 1, 0, -1, -1, -1, 0],
		b = [0, -1, 0, 1, 1, 1, 0, -1, -1],
		i;
	for (i = 1; i <= 8; i++) {
		var sx = x1 + a[i],
			sy = y1 + b[i];
		if (
			sx == x2 &&
			sy == y2 &&
			(enemy(map[x2][y2], st) == 1 || enemy(map[x2][y2], st) == 0)
		)
			judge = 1;
	}
}
function dia(x1, y1, x2, y2, st) {
	var sx, sy, i;
	sx = x1;
	sy = y1;
	for (i = 1; i <= 100; i++) {
		sx++;
		sy++;
		if (sx < 0 || sy < 0 || sx >= 8 || sy >= 8) break;
		if (enemy(map[sx][sy], st) == -1) break;
		if (sx == x2 && sy == y2) judge = 1;
		if (enemy(map[sx][sy], st) == 1) break;
	}
	sx = x1;
	sy = y1;
	for (i = 1; i <= 100; i++) {
		sx++;
		sy--;
		if (sx < 0 || sy < 0 || sx >= 8 || sy >= 8) break;
		if (enemy(map[sx][sy], st) == -1) break;
		if (sx == x2 && sy == y2) judge = 1;
		if (enemy(map[sx][sy], st) == 1) break;
	}
	sx = x1;
	sy = y1;
	for (i = 1; i <= 100; i++) {
		sx--;
		sy++;
		if (sx < 0 || sy < 0 || sx >= 8 || sy >= 8) break;
		if (enemy(map[sx][sy], st) == -1) break;
		if (sx == x2 && sy == y2) judge = 1;
		if (enemy(map[sx][sy], st) == 1) break;
	}
	sx = x1;
	sy = y1;
	for (i = 1; i <= 100; i++) {
		sx--;
		sy--;
		if (sx < 0 || sy < 0 || sx >= 8 || sy >= 8) break;
		if (enemy(map[sx][sy], st) == -1) break;
		if (sx == x2 && sy == y2) judge = 1;
		if (enemy(map[sx][sy], st) == 1) break;
	}
}
function OK(x1, y1, x2, y2, st, pro) {
	var i;
	judge = 0;
	console.log(rock, pro);
	if (rock != 1 && pro != 0) return;
	console.log(x1, y1, x2, y2, rock, st);
	if (rock == 1) {
		if (st <= 16) {
			if (x2 != 8 && pro != 0) return;
			if (x2 == x1 + 1 && y2 == y1 && map[x2][y2] == 0) judge = 1;
			else if (
				move[st - 1] == 0 &&
				x2 == x1 + 2 &&
				y2 == y1 &&
				map[x1 + 1][y1] == 0 &&
				map[x2][y2] == 0
			)
				judge = 1;
			else if (
				x2 == x1 + 1 &&
				Math.abs(y2 - y1) == 1 &&
				map[x2][y2] > 16 &&
				map[x2][y2] != 0
			)
				judge = 1;
			if (x2 == 8 && pro == 0) judge = 0;
		} else {
			if (x2 != 1 && pro != 0) return;
			if (x2 == x1 - 1 && y2 == y1 && map[x2][y2] == 0) judge = 1;
			else if (
				move[st - 1] == 0 &&
				x2 == x1 - 2 &&
				y2 == y1 &&
				map[x1 - 1][y1] == 0 &&
				map[x2][y2] == 0
			)
				judge = 1;
			else if (
				x2 == x1 - 1 &&
				Math.abs(y2 - y1) == 1 &&
				map[x2][y2] <= 16 &&
				map[x2][y2] != 0
			)
				judge = 1;
			if (x2 == 1 && pro == 0) judge = 0;
		}
	}
	if (rock == 2) ten(x1, y1, x2, y2, st);
	if (rock == 3) hourse(x1, y1, x2, y2, st);
	if (rock == 4) dia(x1, y1, x2, y2, st);
	if (rock == 5) {
		ten(x1, y1, x2, y2, st);
		dia(x1, y1, x2, y2, st);
	}
	if (rock == 6)
		king(
			x1,
			y1,
			x2,
			y2,
			st
		); /*
	if (q + r + b + n == 1) {
		if (rock != 1) judge = 0;
		if (st <= 16 && rock == 1 && pos[st - 1].y != 7) judge = 0;
		if (st > 16 && rock == 1 && pos[st - 1].y != 0) judge = 0;
		if (q == 1) rockState[st - 1] = 5;
		if (b == 1) rockState[st - 1] = 4;
		if (n == 1) rockState[st - 1] = 3;
		if (r == 1) rockState[st - 1] = 2;
		console.log(st > 16 && rock == 1 && pos[st - 1].y != 0);
	}*/
}
function ctoi(x1) {
	if (x1 >= "a" && x1 <= "h") {
		if (x1 == "a") x1 = 1;
		if (x1 == "b") x1 = 2;
		if (x1 == "c") x1 = 3;
		if (x1 == "d") x1 = 4;
		if (x1 == "e") x1 = 5;
		if (x1 == "f") x1 = 6;
		if (x1 == "g") x1 = 7;
		if (x1 == "h") x1 = 8;
	} else if (x1 >= "A" && x1 <= "H") {
		if (x1 == "A") x1 = 1;
		if (x1 == "B") x1 = 2;
		if (x1 == "C") x1 = 3;
		if (x1 == "D") x1 = 4;
		if (x1 == "E") x1 = 5;
		if (x1 == "F") x1 = 6;
		if (x1 == "G") x1 = 7;
		if (x1 == "H") x1 = 8;
	} else if (x1 >= "1" && x1 <= "8") {
		x1 = x1 * 1;
	}
	return x1;
}
var move_log = new Array(3),
	move_check = 0;
function change(x) {
	if (x == "q" || x == "Q") return 5;
	else if (x == "r" || x == "R") return 2;
	else if (x == "b" || x == "B") return 4;
	else if (x == "n" || x == "N") return 3;
	else return 0;
}
io.on("connection", function(socket) {
	count++;
	player[count] = socket.id;
	io.to(socket.id).emit("my number", count);
	if (count == 2) {
		var i, j;
		for (i = 0; i < 32; i++) move[i] = 0;
		for (i = 1; i <= 8; i++) {
			for (j = 1; j <= 8; j++) {
				map[i][j] = 0;
				stat[i][j] = 0;
				if (i == 1) {
					map[i][j] = j;
					matchStat(i, j);
				}
				if (i == 2) {
					map[i][j] = j + 8;
					stat[i][j] = 1;
				}
				if (i == 8) {
					map[i][j] = j + 24;
					matchStat(i, j);
				}
				if (i == 7) {
					map[i][j] = j + 16;
					stat[i][j] = -1;
				}
			}
		}
		console.log(stat);
	}
	socket.on("move", function(x1, y1, x2, y2, pro) {
		if (count != 2) return;
		if (move_check % 2 == 1 && player[1] == socket.id) return;
		if (move_check / 2 == 1 && player[2] == socket.id) return;
		if (
			alpha(x1) == false ||
			alpha(x2) == false ||
			numb(y1) == false ||
			numb(y2) == false
		) {
			console.log("no");
			return;
		}
		if (x1 == x2 && y1 == y2) {
			console.log("no");
			return;
		}
		x1 = ctoi(x1);
		x2 = ctoi(x2);
		y1 = ctoi(y1);
		y2 = ctoi(y2);
		pro = change(pro);
		var t1, t2;
		t1 = x1;
		t2 = x2;
		x1 = 9 - y1;
		x2 = 9 - y2;
		y1 = t1;
		y2 = t2;
		rock = Math.abs(stat[x1][y1]);
		judge = 0;
		if (player[1] == socket.id && stat[x1][y1] > 0) return;
		if (player[2] == socket.id && stat[x1][y1] < 0) return;
		OK(x1, y1, x2, y2, map[x1][y1], pro);
		if (judge == 1) {
			if (player[1] == socket.id) {
				pro *= -1;
				move_log[1] = { x1: x1, y1: y1, x2: x2, y2: y2, p: pro };
				move_check += 1;
			} else {
				move_log[2] = { x1: x1, y1: y1, x2: x2, y2: y2, p: pro };
				move_check += 2;
			}
			move[map[x1][y1] - 1] = 1;
			io.to(socket.id).emit("admit");
		}
		if (move_check == 3) {
			console.log("good");
			move_check = 0;
			io.emit("disadmit");
			var r1, r2, s1, s2;
			r1 = map[move_log[1].x1][move_log[1].y1];
			r2 = map[move_log[2].x1][move_log[2].y1];
			s1 = stat[move_log[1].x1][move_log[1].y1];
			s2 = stat[move_log[2].x1][move_log[2].y1];
			map[move_log[1].x1][move_log[1].y1] = 0;
			map[move_log[2].x1][move_log[2].y1] = 0;
			stat[move_log[1].x1][move_log[1].y1] = 0;
			stat[move_log[2].x1][move_log[2].y1] = 0;
			if (
				!(
					move_log[1].x2 == move_log[2].x2 &&
					move_log[1].y2 == move_log[2].y2
				)
			) {
				map[move_log[1].x2][move_log[1].y2] = r1;
				map[move_log[2].x2][move_log[2].y2] = r2;
				stat[move_log[1].x2][move_log[1].y2] = s1;
				stat[move_log[2].x2][move_log[2].y2] = s2;
				if (move_log[1].p != 0)
					stat[move_log[1].x2][move_log[1].y2] = move_log[1].p;
				if (move_log[2].p != 0)
					stat[move_log[2].x2][move_log[2].y2] = move_log[2].p;
			}
			io.emit("board", map, stat);
			console.log(stat);
		}
	});
});
http.listen(3000, function() {
	console.log("server on!");
});
