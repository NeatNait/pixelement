var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8081);


//Simple server for the controller gui
function handler (req, res) {
  fs.readFile(__dirname + '/controller.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading controller.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

//Listen to the connection event
io.sockets.on('connection', function (socket) {

  //On any connection reset the controllers
  io.sockets.emit('newgamestate', { status: 'newgame' });

  //Listen the keypresses from the controller
  socket.on('sendmovement', function (data) {
    console.log(data);
    //Push the controller keypress to the game
    io.sockets.emit('controller', data);
  });

  //Listen new game states from the game
  socket.on('sendgamestate', function (data) {
    console.log(data);
    //Push the game state to the clients
    io.sockets.emit('newgamestate', data);
  });

});
