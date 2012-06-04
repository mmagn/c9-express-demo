var application_root = __dirname,
    express = require("express"),
    path = require("path");
var app = express.createServer(),
    io = require('socket.io').listen(app);

app.configure(function(){
  // the bodyParser middleware parses JSON request bodies
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "static")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('views', path.join(application_root, "views"));
  app.set('view engine', 'ejs')
});

app.get('/', function(req, res){
    var locals = {};
    locals.title = "Hello from EJS !";
    res.render('layout', locals);
});

app.listen(process.env.PORT);

var counter = 0;

io.sockets.on('connection', function (socket) {
    counter++;
    socket.emit('upd', { counter: counter });
    
    socket.on('disconnect', function () {
        counter--;
        io.sockets.emit('upd', { counter: counter });
    });
});