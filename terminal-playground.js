"use_strict";

var Rx = require('rxjs/Rx'),
    term = require( 'terminal-kit' ).terminal;

term.grabInput();

// term.on('mouse', (name, data) => {
//     console.log( "'mouse' event:" , name , data ) ;
// });



var terminalOnEventStream = Rx.Observable.bindCallback(term.on);

terminalOnEventStream('key').subscribe(
  (key , matches , data) => term.green(key , matches , data),
  e => term.red(e));



term.on('key', (key , matches , data) => {
  // console.log( "'key' event:" , key, matches, data) ;
  if ( key === 'CTRL_C' ) { process.exit() ; }
});
