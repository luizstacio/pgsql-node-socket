(function() {
  var socket = io(),
    dataBody = [];

  socket.on('notify', function(data) {

    data.forEach(function(item, index) {
      dataBody.forEach(function(_item, _index) {
        if (_item.id === item.id) {
          dataBody[_index] = item;
          delete data[index];
        }
      });
    });

    dataBody = dataBody.concat(data);

    document.body.innerHTML = '<span>' + dataBody.map(function(item) {
      return JSON.stringify(item);
    }).join('<br/>') + '</span>';
  });
}());