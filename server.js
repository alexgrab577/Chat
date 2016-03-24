var http = require('http');
var express = require('express'),
    app = module.exports.app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
//server.listen(80);  //listen on port 80

var currentName = '';

var routes = require('./routes');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat', currentName + ': ' + msg);
  });
    socket.on('add name', function(name){
    currentName = name;
    console.log('adding name: ' + currentName);
    io.emit('newUser', currentName + ' connected to chat');
  });
   socket.on('disconnect', function(){
    io.emit('newUser', currentName + ' disconnected from chat');
  });
  //socket.emit('chat', "test");
});



server.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});