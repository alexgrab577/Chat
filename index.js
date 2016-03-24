var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var currentName = "";
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    var message = 't: ' + msg;
    console.log('message: ' + message);
    socket.emit('chat', message + 'peppers');
  });
  socket.on('add name', function(name){
    console.log('nameAdd: ' + name);
    currentName = name;

    console.log('nameAdd2: ' + currentName);
  });
  //socket.emit('chat', "test");
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});