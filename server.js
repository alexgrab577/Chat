var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');

var app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server); 

//pass a http.Server instance
//server.listen(80);  //listen on port 80

var userNames = {};
var currentReq;
var routes = require('./routes');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  
  	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', socket.username, '  ' + data);
	});
    socket.on('addUser', function(username){
        console.log('adding name: ' + username);
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		userNames[username] = username;

		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', '  you have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', '  ' + username + ' has connected');
		// update the list of users in chat, client-side
        
		io.sockets.emit('updateusers', userNames);
    
    //io.emit('newUser', username + ' connected to chat');
  });
   socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete userNames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', userNames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
  //socket.emit('chat', "test");
});


app.use(cookieParser());
//app.use(express.session({secret: '1234567890QWERTY'}));


server.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});