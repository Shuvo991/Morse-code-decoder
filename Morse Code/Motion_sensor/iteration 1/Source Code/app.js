var http = require('http');
var fs = require('fs');

// Loading the index file . html displayed to the client
var server = http.createServer(function(req, res) {
    fs.readFile('index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});


// Loading socket.io
var io = require('socket.io').listen(server);

var bone = require('bonescript');       // bonescript library
var pirSignal ;                         // for storing PIR signal
var pirPin = 'P8_11';                   // PIR input pin
var pirCounter = 0;                     // for counting PIR high signals
var resCounter = 0;                     // for counting timeout
var done = true;                        //
var motionCode ;

// User story 1
bone.pinMode(pirPin,bone.INPUT);        // initiate bonescript library


// When a client connects, print a warm welcoming message to console
io.sockets.on('connection', function (socket) {

setInterval(function(){         // doing operations each 1 second

  var signal = bone.digitalRead(pirPin);        // getting a signal from sensor
  pirSignal = readSignal(signal,done);          // readSignal function will only return when the motion stops
  if(pirSignal != undefined) {                  // if the motion is determined to be S or L
        motionCode += pirSignal;
         resCounter = 0;
         socket.emit('motion',pirSignal);
    }
  else if (resCounter > 3) {                    // This case is when user wants to clear the curent combination
         var letter =  convertSignal(motionCode,morseTable);    // check if current combination match any letter
         if (letter != 'null'){                 // if it matches then send and log
         socket.emit('letter',letter);
         console.log('Letter: ' + letter);
         }
         motionCode = "";
         resCounter = 0;
    }
;},1000,bone,pirSignal,done);

});

function convertSignal(motionSet,codeTable){
// This funcion takes in a combination of motion for example LSLS and checks if it matches any combination
// in the codeTable and returns a letter
// complexity: worst-case = O(n) where n is the size of the table
// precondition: table must exist
// postcondition: returns the letter or null if the combination was not found
  var letter = codeTable[motionSet];
  if (letter == undefined) { return 'null';}
  else { return letter;}

}

function readSignal(state,done){
// This function checks for motion and determines if the motion is long or short
// complexity: O(1) because there is no loop
// precondition: all variables must be initialized in global
// postcondition: updates the variables based on the signal received
  if (state == 1){ pirCounter += 1; done = false;}

  else { done = true; resCounter += 1;}

  if ( pirCounter == 4){
        console.log('Long motion detected.');
        pirCounter = 0;
        return 'L';
        }
  else if (done == true && pirCounter > 1){
        console.log('Short motion detected.');
        pirCounter = -1;
        return 'S';}
}


server.listen(2428);

var morseTable = {
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
 'LLSS' : 'Z'
};


