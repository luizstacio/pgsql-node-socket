var pg = require ('pg');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var pgConString = 'postgres://<user>:<password>@<host>/<server>';

var clientConnected;

pg.connect(pgConString, function(err, client) {
  if (err) return console.log(err);
  
  clientConnected = client;
  
  client.on('notification', function(msg) {
    var data = JSON.parse(msg.payload);

    eventEmitter.emit(data.table, data.row);
  });

  client.query('LISTEN watchers', function () {
    console.log('Connected on postgresql');
  });
});

module.exports = {
  getConnection: function () {
    return clientConnected;
  },
  events: eventEmitter
}