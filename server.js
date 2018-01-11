var express = require('express'); // using express fw
var http = require('http'); // using http
var app = express(); //create new express server
var sentencers = require('sentencer');

var connect = require('connect'),
    socketio = require('socket.io');

var server = http.createServer(app);
var port = process.env.PORT || 3000; // using port number

var path = require('path');
app.use(express.static(path.join(__dirname, 'public'))); // default public directory

var data = [
    {text:'Hi learn angular', done:true},
    {text:'Woo build an angular app', done:false}];
    // starting data

var makeSentences = function(){
  var senten = sentencers.make("This sentence has {{ a_noun }} and {{ an_adjective }} {{ noun }} in it.");
  return senten;
}

var io = socketio.listen(server); // socket io server side
io.sockets.on('connection', function(socket) { // connection on

  socket.emit('change', data); // push a start data
  //setInterval(function(){data.push({text:makeSentences(), done:false});socket.emit('change', data);},5000); // create random sentences every 5 second and push to array
  
  //console.log(socket.id);
  socket.on('change', function(obj) {
    //console.log(obj);
    data = obj;
    socket.broadcast.emit('change', data);
  });
});

app.get('/', function(req, res){ // default server page 
  /// res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.sendFile(index.html); // public/index.html
})

server.listen(port, function(){
  console.log('chatroom listen on port --> ' + port);
});