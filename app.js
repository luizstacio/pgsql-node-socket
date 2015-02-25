var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var pgsql = require('./pgsql');

var lastSocket;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  lastSocket = socket;

  pgsql.getConnection().query('SELECT * FROM PUBLIC.TEST_NOTIFY', function (err, result) {
    lastSocket.emit('notify', result.rows);
  });
});

pgsql.events.on('test_notify', function (data) {
  lastSocket.emit('notify', [data]);
  lastSocket.broadcast.emit('notify', [data]);
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});