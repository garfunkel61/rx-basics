"use strict";

var Rx = require('rxjs/Rx');

var array1 = [1, 2];
var array2 = [3, 4, 5];

var firstEventStreamy = Rx.Observable.interval(10).take(2).map(e => array1[e]);
var secondEventStream = Rx.Observable.interval(100).take(3).map(e => array2[e]);

// 1----2------------------->
// -----------3----4-----5-->
//         .merge()
// 1----2-----3----4-----5-->

var mergedEventStream = firstEventStreamy.merge(secondEventStream);

mergedEventStream.subscribe(e => console.log(e));
