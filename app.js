var express = require('express'),http = require('http');
var app = express();
var server = http.createServer(app);
app.set('views',__dirname + '/views');
app.configure(function(){
  app.use(express.static(__dirname));
});
app.get('/',function(req,res){
	res.render('index.jade',{layout:false});
});
server.listen(8000);

//websockets

var io = require('socket.io').listen(server);
var usuariosConectados = {};

io.sockets.on('connection',function(socket){
	
});
