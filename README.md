# config-request [![Build Status](https://travis-ci.org/chrisinajar/config-request.svg?branch=master)](https://travis-ci.org/chrisinajar/config-request) [![Dependency Status](https://david-dm.org/chrisinajar/config-request.svg)](https://david-dm.org/chrisinajar/config-request) [![devDependency Status](https://david-dm.org/chrisinajar/config-request/dev-status.svg)](https://david-dm.org/chrisinajar/config-request#info=devDependencies)
Simple small globally configurable request object

## Install

`npm install config-request`

## Usage

```js
var request = require('config-request');
request.configure({
  baseUrl: 'http://foo.bar/'
});

// ...

request.get('/path/to', {}, function (err, data) {
  
});
```

If you're using [observables](https://www.npmjs.com/package/observ) you could...

```js
request.configure(state.request.config());
state.request.config(request.configure);
```

## Acknowledgement
Most of this code is taken from [eaze-request](https://www.npmjs.com/package/eaze-request).

# License
MIT
