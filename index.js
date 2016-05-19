var request = require('xhr-request');
var join = require('url-join');
var extend = require('xtend');
var assign = require('xtend/mutable');
var isFunction = require('is-function');
var httpError = require('http-status-error');
var isError = require('is-error-code');
var jsonParse = require('safe-json-parse');
var isObject = require('is-obj');
var Query = require('query-string-flatten');

var methods = ['get', 'post', 'put', 'patch', 'head', 'delete'];

module.exports = httpMethods(Request);

Request.configure = configure;

var config = {
  baseUrl: 'http://localhost:8000',
  token: null
};

// RequestEvent = Event()

function Request (path, options, callback) {
  path = path || '';
  if (isFunction(options)) {
    callback = options;
    options = {};
  }
  options = extend(options);
  setQuery(options);
  setToken(options);
  var url = join(config.baseUrl, path);

  return request(url, options, responseHandler(callback, {
    url: url,
    method: options.method
  }));
}

function setToken (options) {
  if (!options.token && !config.token) { return; }
  options.headers = options.headers || {};
  var keyName = options.authorization || config.authorization || 'Authorization';

  options.headers[keyName] = options.token || config.token;
  delete options.token;
}

function setQuery (options) {
  var query = options.query;
  if (!query) return;
  options.query = (typeof query === 'string' ? String : Query)(query);
}

function responseHandler (callback, options) {
  // var start = new Date()

  return function handleResponse (err, data, response) {
    // var end = new Date()

    if (err) {
      return callback(err);
    }

    if (isError(response.statusCode)) {
      return createError(data, response, function (err) {
        callback(err);
      });
    }

    callback(null, data);
  };
}

function createError (data, response, callback) {
  var error = httpError(response.statusCode);
  if (!data) return callback(error);
  if (data) {
    if (isObject(data)) {
      return callback(assign(error, data));
    }
    jsonParse(data, function (err, json) {
      if (err) return callback(err);
      callback(assign(error, json));
    });
  }
}

function configure (_config) {
  assign(config, _config);
}

function httpMethods (request) {
  methods.forEach(function createMethod (method) {
    request[method] = function (path, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      options.method = method;

      return request(path, options, callback);
    };
  });

  return request;
}
