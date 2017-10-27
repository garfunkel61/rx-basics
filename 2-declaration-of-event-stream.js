"use strict";

var Rx = require('rxjs/Rx');

var streamA = Rx.Observable.of(3, 4, 5);
var streamB = streamA.map(event => event * 10);

streamA.subscribe(event => console.log('event A', event));
streamB.subscribe(event => console.log('event B', event));
