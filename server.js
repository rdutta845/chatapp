var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connection = [];


server.listen(process.env.PORT || 3000); 
console.log("server running");

//routing
app.get('/', function(req, res){
	res.sendFile(__dirname +'/index.html');
});

io.sockets.on('connection', function(socket){
	connection.push(socket);
	console.log("Connected: %s sockets Connected", connection.length);
	
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connection.splice(connection.indexOf(socket), 1);
		console.log("Disconnected: %s socket connected", connection.length);
	});

	socket.on('send message', function(data){
		console.log(data);
		console.log("socket", socket.message);
		io.sockets.emit('new message', {msg:data, name:socket.username});
	})

	socket.on('new user', function(data, callback){
		console.log(data);
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
		
	});
	function updateUsernames(){
		io.sockets.emit("get users", {users: users});
	}

});