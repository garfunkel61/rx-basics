'use strict';

// application files
import './app.scss';

// external libraries
import Rx from 'rxjs/Rx';
import $ from "jquery";

// ===========================
// CLICKERS COUNT
// ===========================

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


// ===========================
// USERS
// ===========================

let startupRequestStream,
    onRefreshRequestStream,
    responseStream,
    refreshClicksStream,
    refreshButton = document.querySelector('.refreshButton');

startupRequestStream = Rx.Observable.of('https://api.github.com/users');

// -----c------------> gettings clicks, map: to requests urls
// -----rqU---------->

refreshClicksStream = Rx.Observable.fromEvent(refreshButton,  'click');
onRefreshRequestStream = refreshClicksStream
  .map(ev => {
    let offset = Math.floor(Math.random()*500);
    return 'https://api.github.com/users?since=' + offset;
  });



// -------rqU---------rqU---> refresClick request
// srqU---------------------> startup request, merged:
// srqU---rqU---------rqU---> flatMap: - nie .map bo powstał by metastream (event był by streamem, więc go spłaszczamy)
// usD----usD---------usD--->
// ^^
responseStream = onRefreshRequestStream.merge(startupRequestStream)
  .flatMap(requestUrl => Rx.Observable.fromPromise($.getJSON(requestUrl)));


// ---usD---------------> map
// N---uD-------uD------> startWith null
// -----------N---------> refreshClicksStream, ustawiamy user data na null i mergujemy z userStream
// N---ud-----N-uD------> userData zemergorwany z nullami pochodzącymi z kliknieć refresh
//^^
function createUserStream(responseStream) {
  return responseStream
    .map(listUsers => listUsers[Math.floor(Math.random()*listUsers.length)])
    .startWith(null)
    .merge(refreshClicksStream.map(ev => null));
}

let user1Stream = createUserStream(responseStream),
    user2Stream = createUserStream(responseStream),
    user3Stream = createUserStream(responseStream);

function renderUser(user, selector) {
  let elem = document.querySelector(selector),
      nameElem = elem.querySelector('.user-name'),
      avatarElem = elem.querySelector('.user-avatar');
  if (user) {
    avatarElem.src = user.avatar_url;
    nameElem.textContent = user.login;
  } else {
    avatarElem.src = '';
    nameElem.textContent = 'null';
  }
}

user1Stream.subscribe(user => renderUser(user, '.user1'));
user2Stream.subscribe(user => renderUser(user, '.user2'));
user3Stream.subscribe(user => renderUser(user, '.user3'));
