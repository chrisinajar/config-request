var test = require('tape');
var request = require('./index');
var Server = require('./server');

var methods = ['get', 'post', 'put', 'patch', 'head', 'delete'];
methods.forEach(function (method) {
  test(method, function (t) {
    t.plan(4);
    var server = Server();
    Server.start(server);

    server[method]('/', function (req, res) {
      t.ok(true, 'receives get');
      res.send('ok');
    });
    request[method]('/', function (err, data) {
      t.notOk(err, 'not an error');
      t.ok(true, 'returns');
      // head doesn't send data
      t.equal(data, (method === 'head' ? '' : 'ok'));

      // done
      Server.stop(server);
    });
  });
});

test('token config', function (t) {
  t.plan(10);
  var server = Server();
  Server.start(server);

  request.configure({
    token: 'hello'
  });

  server.get('/', function (req, res) {
    t.equal(req.headers['authorization'], 'hello', 'receives token');
    t.ok(true, 'receives get');
    res.send('ok');
  });
  server.get('/xauth', function (req, res) {
    t.equal(req.headers['x-auth-token'], 'hello', 'receives token');
    t.ok(true, 'receives get');
    res.send('ok');
  });
  request.get('/', function (err, data) {
    t.notOk(err, 'not an error');
    t.ok(true, 'returns');
    t.equal(data, 'ok');

    request.configure({
      authorization: 'X-Auth-Token'
    });
    request.get('/xauth', function (err, data) {
      t.notOk(err, 'not an error');
      t.ok(true, 'returns');
      t.equal(data, 'ok');

      // done
      Server.stop(server);
    });
  });
});
