"use strict";

var Rx = require('rxjs/Rx');

var arraySource = [ 1, 2, 3, 4, 5, '6', 7, 8, 'test'];

var arrayResult =  arraySource
  .map(e => parseInt(e))
  .filter(e => !isNaN(e))
  .reduce((e, f) => e + f);

console.log('arrayResult: ', arrayResult);

// Creating an event-stream that will take 9 elements from array, each in 500 miliseconds interval
var eventStreamSource = Rx.Observable.interval(500).take(9)
  .map(e => arraySource[e]);

var eventStreamResult = eventStreamSource
  .map(e => parseInt(e))
  .filter(e => !isNaN(e))
  .reduce((e, f) => e + f);

console.log('eventStreamResult: ');
eventStreamResult.subscribe(e => {
  console.log(e);
})
