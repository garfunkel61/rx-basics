"use strict";

var Rx = require('rxjs/Rx');

var rp = require('request-promise');

var options = {
    uri: 'https://api.github.com/users',
    headers: { 'User-Agent': 'Request-Promise' },
    json: true // Automatically parses the JSON string in the response
};

var requestStream = Rx.Observable.of(options);

var responseStream = requestStream
  .flatMap(options => Rx.Observable.fromPromise(rp(options)));

responseStream.subscribe(event => console.log(event));
