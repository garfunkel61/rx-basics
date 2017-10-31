'use strict';

// application files
import './app.scss';

// external libraries
import Rx from 'rxjs/Rx';
import $ from "jquery";

let singleClickButton = document.querySelector('.singleClick'),
    doubleClickButton = document.querySelector('.doubleClick'),
    sdClickButton = document.querySelector('.sdClick'),
    singleLabel = document.querySelector('.singleAmount'),
    doubleLabel = document.querySelector('.doubleAmount'),
    sdSLabel = document.querySelector('.sdSAmount'),
    sdDLabel = document.querySelector('.sdDAmount'),
    singleClickEventStream,
    doubleClickEventStream,
    doubleClickButtonSingleClickEventStream,
    sdSingleClickEventStream,
    sdClickEventStream,
    singleAmount = 0,
    doubleAmount = 0,
    sdSAmount = 0,
    sdDAmount = 0;

singleClickEventStream = Rx.Observable.fromEvent(singleClickButton, 'click')
  .map(e => 1) // klikniecie mapujemy na wartość 1
  .subscribe(e => {
    singleAmount += e; // zwiekszamy ilość kliknieć
    singleLabel.textContent = singleAmount; // wyświetlamy ilość kliknięć
  });

doubleClickButtonSingleClickEventStream = Rx.Observable.fromEvent(doubleClickButton, 'click');
doubleClickEventStream = doubleClickButtonSingleClickEventStream
  .bufferWhen(() => doubleClickButtonSingleClickEventStream.debounceTime(250)) // wszystkie kliknięcia w ciągu 250 mlSek zbieramy w małe arraye (to są eventy całego streamu)
  .map(arr => arr.length) // mapujemy małe array na ich długości
  .filter(len => len === 2) // wyławiame te, które miały długość 2
  .map(e => 1) // klikniecie podwujne mapujemy na wartość 1
  .subscribe(e => {
    doubleAmount += e; // zwiekszamy ilość kliknieć podwójnych
    doubleLabel.textContent = doubleAmount; // wyświetlamy ilość kliknięć podwójnych
  })


// ----cc----c----cc---c--ccc------c----ccc----cc----> bufferWhen
// ---[2]---[1]--[2]--[1]-[3]-----[1]---[3]---[2]----> map
// ---[2]---[1]--[2]--[1]---------[1]---------[2]----> filter
// ---'d'---'s'--'d'--'s'---------'s'---------'d'----> map
// ^^
sdSingleClickEventStream = Rx.Observable.fromEvent(sdClickButton, 'click');
sdClickEventStream = sdSingleClickEventStream
  .bufferWhen(() => sdSingleClickEventStream.debounceTime(250))
  .map(arr => arr.length)
  .filter(len => len <= 2)
  .map(len => len === 1 ? 's' : 'd')
  .subscribe(e => {
    if (e === 's') {
      sdSAmount += 1;
      sdSLabel.textContent = sdSAmount;
    } else {
      sdDAmount += 1;
      sdDLabel.textContent = sdDAmount;
    }
  });
