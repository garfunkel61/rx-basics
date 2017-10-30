"use strict";

var Rx = require('rxjs/Rx'),
    rp = require('request-promise'),
    term = require( 'terminal-kit' ).terminal;

var requestOptions = {
    uri: 'https://api.github.com/users',
    headers: { 'User-Agent': 'Request-Promise' },
    json: true // Automatically parses the JSON string in the response
};

// Terminal settings

term.fullscreen(true);
term.grabInput({ mouse: 'button' });

term.on('key', (key , matches , data) => {
  if ( key === 'CTRL_C' ) { process.exit() ; }
  if (key === 'CTRL_R') { term.red("Refreshing...") }
});

// Helpers

function getRandomArbitrary(max) {
    return Math.floor((Math.random()*max));
}

// Display methods

function renderMenu() {
  term.gray("Refresh: ctrl+r | Exit: ctrl+c |\n");
  term.gray("----------------------------------------------\n");
}

function renderUser(userData) {
  term.gray("********************========").blue(" USER ").gray("========********************" + "\n");
  term.blue("=== User:     ").green(userData.login + "\n");
  term.blue("=== Avatar:   ").green(userData.avatar_url + "\n");
  term.blue("=== Is Admin: ").green(userData.site_admin + "\n");
  term("\n");
}

// Logic

var requestStream = Rx.Observable.of(requestOptions);
var responseStream = requestStream
  .flatMap(options => Rx.Observable.fromPromise(rp(requestOptions)));

var user1Stream = responseStream.map(users => users[getRandomArbitrary(users.length-1)]),
    user2Stream = responseStream.map(users => users[getRandomArbitrary(users.length-1)]),
    user3Stream = responseStream.map(users => users[getRandomArbitrary(users.length-1)]);

renderMenu();
user1Stream.subscribe(userData => renderUser(userData)),
user2Stream.subscribe(userData => renderUser(userData)),
user3Stream.subscribe(userData => renderUser(userData));
