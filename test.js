var test = require('tape');
var request = require('./index');
var Server = require('./server');

test('get', function (t) {
  t.plan(4);
  var server = Server();
  Server.start(server);

  server.get('/', function (req, res) {
    t.ok(true, 'receives get');
    res.send('ok');
  });
  request.get('/', function (err, data) {
    t.notOk(err, 'not an error');
    t.ok(true, 'returns');
    t.equal(data, 'ok');

    // done
    Server.stop(server);
  });
});
