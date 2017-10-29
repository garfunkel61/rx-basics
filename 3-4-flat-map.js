"use strict";

var Rx = require('rxjs/Rx');
var rp = require('request-promise');
var options = {
    uri: 'https://api.github.com/users',
    headers: { 'User-Agent': 'Request-Promise' },
    json: true // Automatically parses the JSON string in the response
};

function getRandomArbitrary(min, max) {
    return Math.floor((Math.random() * (max - min) + min));
}

function renderUser(userData) {
  console.log(" ");
  console.log("=== User:     ", userData.login);
  console.log("=== Avatar:   ", userData.avatar_url);
  console.log("=== Is Admin: ", userData.site_admin);
  console.log("****************************************************************");
}


var requestStream = Rx.Observable.of(options);
var responseStream = requestStream
  .flatMap(options => Rx.Observable.fromPromise(rp(options)));

var user1Stream = responseStream.map(users => users[getRandomArbitrary(1, 46)]),
    user2Stream = responseStream.map(users => users[getRandomArbitrary(1, 46)]),
    user3Stream = responseStream.map(users => users[getRandomArbitrary(1, 46)]);

user1Stream.subscribe(userData => renderUser(userData)),
user2Stream.subscribe(userData => renderUser(userData)),
user3Stream.subscribe(userData => renderUser(userData));
