var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use('/public', express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

// dataset
var messages = [
    {name: 'John Doe', message: 'Hello'},
    {name: 'Jane Doe', message: 'Morning'}
];

io.on('connect', function (socket) {
  console.log(messages);
  socket.emit('messages', messages);

  socket.on('addMessage', function (data) {
    console.log(data);

    messages.push(data);

    socket.broadcast.emit('messages', messages);
    socket.emit('messages', messages);
  })
});

server.listen(3000);
