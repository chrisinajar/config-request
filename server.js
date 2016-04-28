var express = require('express');

module.exports = Server;

Server.start = start;
Server.stop = stop;

function Server () {
  var app = express();

  return app;
}

function stop (app) {
  app._server.close();
  delete app._server;

  return app;
}

function start (app) {
  if (app._server) {
    return app;
  }
  app._server = app.listen(8000);

  return app;
}
