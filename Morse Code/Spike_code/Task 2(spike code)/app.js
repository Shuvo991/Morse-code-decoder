                                                                                                       

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

// When a client connects, print a warm welcoming message to console
io.sockets.on('connection', function (socket) {
    console.log('a client is connected');

    // When the client sends 'run' message
    socket.on('run',function(message){
        // This is the code table ( currently only has 5 letters)
        var moreCodeTable=[
        { letter: 'a', code : '1001'},
        { letter: 'b', code : '0011'},
        { letter: 'c', code : '0101'},
        { letter: 'd', code : '1110'},
        { letter: 'e', code : '1111'}];

        var inputList = [];     // This is used to add the random variables eg, ['1001']
        var time1;              // Will be used to record the process time of Method1
        var time2;              // Will be used to record the process time of Method2
        var varstr = '01';      // the strings that we want to permute
        var strsize = 4;        // the size of each permutation
                genInput(varstr,strsize,inputList,100000);      // generates n  fake inputs (n is the number entered)
                runBenchmark1(moreCodeTable,inputList);         // run the first method (strings comparison)
                prepSpike2(moreCodeTable,inputList);            // convert the code and input table to method 2 format
                runBenchmark2(moreCodeTable,inputList);         // run the second method (array comparison)
                socket.emit('rez',{s1: time1, s2: time2});      // send moth running time (in seconds) to client
                console.log("Spike1  took: " + time1 + " ms");  // print out method 1 duration
                console.log("Spike2  took: " + time2 + " ms");  // print out method 2 duration


// This function takes the codelist and an empty array and a number
// it appends n random codes from the codelist to the array where n == number
  var len = varstr.length;
  var i;
  var j;
  for (i=0; i<number; i++){
        var tmp = '';
        for(j=0;j<strsize;j++){
                tmp += varstr[Math.floor((Math.random()*100))% len];
        };
        inputList.push(tmp);

        };
  };

function runBenchmark1(codeTable,inputTable){
// Iterate through the input table and for each input iterate through the code
        // if the code is similar then return the letter
        // if couldnt found return null
  var i;
  var result;
  start = new Date();
  for (input in inputTable){
     result = null
     for(code in codeTable){
        if (inputTable[input] == codeTable[code].code){
                result = codeTable[code].letter;
                break;
                        }       };
        socket.emit('code',result);
        console.log(result);

        };
 time1 = Math.round((new Date() - start));
   };

function runBenchmark2(codeTable,inputTable){
// Iterate through the input table and for each input iterate through the code $
        // if the code is similar then return the letter
        // if couldnt found return null

  var i;
  var result;
  start = new Date();
  for (input in inputTable){
     result = null
     for(code in codeTable){
        if (equal(inputTable[input],codeTable[code].code) == true){
                result = codeTable[code].letter;
                break;
                        }       };
        socket.emit('code',result);
        console.log(result);

        };
   time2 = Math.round((new Date() - start));

   };



function equal(a, b) {
// this function compares two lists
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


function prepSpike2(codeTable,inputList){
//This function turns the format for codeTable and inputList  from ['0010'] to ['0','0','1','0']
  for(i in codeTable){
        codeTable[i].code = codeTable[i].code.split('');
                }
  for(i in inputList){
        inputList[i] = inputList[i].split('');
                }

};

    });


});

server.listen(2427);

