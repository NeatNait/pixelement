// File dedicated to create the server

var express  = require("express"),
    app      = express(),
    http     = require("http"),
    server   = http.createServer(app),
    mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("ok");
});


// Mongoose schema for score persistance
var Score = mongoose.model('Score', { 
  player: String,
  points: Number,
  meters: Number,
  date: { type : Date, default: Date.now },
  ip: String
});

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    /*res.header('Access-Control-Allow-Origin', config.allowedDomains);*/
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


// Configure express variables and middleware
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname));
  app.use(allowCrossDomain);
  app.use(app.router);
});


app.get('/', function(req, res) {
  res.send("Hello world!");
});


// REST api for obtaining first 1000 player of the ranking
app.get('/api/score', function (req, res){

  //ordered by points
	Score.find().sort({points: -1}).limit(1000).exec(function (err, scores) {
		if (err)
			console.log(err);

    return res.send(scores);
		console.log(scores);
	});

});

// REST api for registering new player score
app.post('/api/score', function (req, res){
  
  var score,
      player;
  
  console.log("POST: ");
  console.log(req.body);

  if (req.body.player == null || req.body.player == "")
    player = "player";
  else
    player = req.body.player;
  
  // Create the new score
  score = new Score({
    player: player,
    points: req.body.points,
    meters: req.body.meters,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
  });

  // Save it in mongodb
  score.save(function (err, createdScore) {
    if (!err) {
      return console.log(createdScore);
    } else {
      return console.log(err);
    }
  });
  
  return res.send(score);
});



// Put the server listening
server.listen(8089, function() {
  console.log("Node server running on http://localhost:8089");
});