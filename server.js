var http = require('http');
var express = require('express'),
    app = module.exports.app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
//server.listen(80);  //listen on port 80


var routes = require('./routes');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    socket.emit('chat', msg);
  });
  //socket.emit('chat', "test");
});



server.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});