var http = require('http');
var fs = require('fs');
// Loading the index file . html displayed to the client
var server = http.createServer(function(req, res) {
    fs.readFile('index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});
var bone = require('bonescript');       // bonescript library
var pirSignal ;                         // for storing PIR signal
var pirPin = 'P8_11';                   // PIR input pin
var pirCounter = 0;                     // for counting PIR high signals
var resCounter = 0;                     // for counting timeout
var done = true;
var motionCode ;
var word = '';
var off = '';
bone.pinMode(pirPin,bone.INPUT);        // initiate bonescript library
var io = require('socket.io').listen(server);   // loading socket io



function runapp(socket){                        // this is the main function
  var mainloop = setInterval(function(){        // doing operations each 1 second
  if(off == 'SK'){clearInterval(mainloop);}     // if the client side turned it off
  var signal = bone.digitalRead(pirPin);        // getting a signal from sensor
  pirSignal = readSignal(signal);               // readSignal function will only return when the motion stops
  if(pirSignal != undefined) {                  // if the motion is determined to be S or L
         motionCode += pirSignal;
         resCounter = 0;
         socket.emit('motion',pirSignal);
         }
  else if (resCounter ==  3) {                  // of signal is 0 and res =3 its time for a new letter
         pirCounter = 0;                        // set counter back to 0 ( prevent motion length cal inaccuracy)
         var letter =  convertSignal(motionCode,morseTable);    // check if current combination match any letter
         if (letter != 'null'){                                 // if it matches
             if(letter == 'SK'){ clearInterval(mainloop);}                      // if the letter is not SK
             word += letter;                                    // add the letter to word
             socket.emit('letter',letter);                      // send to client
             console.log('Letter: ' + letter);
             }
         else{                                                  // if it doesnt match
             socket.emit('letter','---');                       // reset the leter in client side
             console.log('Letter: ' + letter);
             }
         motionCode = "";                                       // reset the motion container eg. "LSSLS" >>> ""
         }
  else if(resCounter == 7){                     // reached the word gap
         if (word.length != 0){                 // if there is letters in word
            socket.emit('word',word);           // send dem letters to client
            console.log('Word: ' + word);
            word = '';                          // reset word to empty
            resCounter = 0;                     // reset the counter
            pirCounter = 0;
            }
        else{
            socket.emit('letter','---');
            socket.emit('motion','---');
            socket.emit('word','---');
            }

         }
  
;},1000,bone,pirSignal,done,word,motionCode,resCounter,pirCounter);

} //end of runapp



var morseTable = {      // this is the Morse code storage
 'SL' : 'A',
 'LSSS' : 'B',
 'LSLS' : 'C',
 'LSS' : 'D',
 'S' : 'E',
 'SSLS' : 'F',
 'LLS' : 'G',
 'SSSS' : 'H',
 'SS' : 'I',
 'SLLL' : 'J',
 'LSL' : 'K',
 'SLSS' : 'L',
 'LL' : 'M',
 'LS' : 'N',
 'LLL' : 'O',
 'SLLS' : 'P',
 'LLSL' : 'Q',
 'SLS' : 'R',
 'SSS' : 'S',
 'L' : 'T',
 'SSL' : 'U',
 'SSSL' : 'V',
 'SLL' : 'W',
 'LSSL' : 'X',
 'LSLL' : 'Y',
 'LLSS' : 'Z',
 'SLSLSL' : '.',
 'LLLLL' : '0',
 'SLLLL' : '1',
 'SSLLL' : '2',
 'SSSLL' : '3',
 'SSSSL' : '4',
 'SSSSS' : '5',
 'LSSSS' : '6',
 'LLSSS' : '7',
 'LLLSS' : '8',
 'LLLLS' : '9',
 'LLSSLL' : ',',
 'LLLSSL' : ':',
 'SSLLSS' : '?',
 'SLLLLS' : "'",
 'LSSSSL' : '-',
 'LSSLS' : '/',
 'LSLLSL' : '()',
 'SLSSLS' : '"',
 'SLLSLS' : '@',
 'LSSSL' : '=',
'SSSLSL' : 'SK'

};



function convertSignal(motionSet,codeTable){
// This funcion takes in a combination of motion for example LSLS and checks if it matches any combination
// in the codeTable and returns a letter
// complexity: worst-case = O(n) where n is the size of the table
// precondition: table must exist
// postcondition: returns the letter or null if the combination was not found


  var letter = codeTable[motionSet];
  if (letter == undefined) { return 'null';}
  else { return letter;}

} //end of function converSignal


function delay(ms){                     // a simple function to delay
  setTimeout(function(){pass;           },ms);
  }



function readSignal(signal){
// This function checks for motion and determines if the motion is long or short
// complexity: O(1) because there is no loop
// precondition: all variables must be initialized in global
// postcondition: updates the variables based on the signal received

  if (signal == 1){ pirCounter += 1; done = false;}     // if pir is high for this itr, increment counter and we are not done

  else { done = true; resCounter += 1;}                 // if pir is low for this itr, increase res and we are done

  if ( pirCounter >= 4){                                // in case the counter has already reached long motion threshould
        console.log('Long motion detected.');
        pirCounter = 0;
        return 'L';
        delay(1000);                                    // to prevent current signal to leak to the next iteration (noise)
        }
  else if (done == true && pirCounter > 1){             // this is the short motion
        console.log('Short motion detected.');
        pirCounter = 0;
        return 'S';
        delay(1000);
        }
  }


server.listen(2424);            // listen to port 2424
io.sockets.on('connection', function (socket) {         // when a client connects
  console.log('client connected');
  socket.on('run',function(message){
        console.log('running app');
        off = '';
        runapp(socket);
        });     // end of run
  socket.on('stop',function(message){
        console.log('stopped by client');
        off = 'SK';
        });     // end of stop
  });   // end of socket.on function


