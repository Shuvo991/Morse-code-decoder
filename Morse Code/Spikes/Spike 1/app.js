// getting all libraries required
var fs = require('fs');
var http = require('http');
socketio = require('socket.io');
var bbb = require('bonescript');

// PIR input pin number according to bonescript Pin Layout
var pin = 'P8_11';

// Initialize the pin as input
bbb.pinMode(pin,bbb.INPUT);

var time;       // to be used to store the start time

//create the webpage to handle client side communication
var server = http.createServer(function(req,res){
        res.writeHead(200,{'Content-type': 'text/html'});
        res.end(fs.readFileSync(__dirname+'/index2.html'));
        }).listen(2427, function() {
        console.log('Listening at: http://localhost:2427');
 });

io = socketio.listen(server);   //start communication
function sendData(){
        var pirState = bbb.digitalRead(pin);    // get PIR status
        time = new  Date().getTime();           // record start time

        io.emit('latency',{latency: time ,state:pirState});     // send status to client
        }
setInterval(sendData,1000);     // will probe each 1 second

io.on('connection',function(socket){    // upon connection from a client
        socket.on('response',function(data){    // when server recieves a response
        var endtime = new Date().getTime();     // record end timestamp
        var total = endtime -time;              // calculate the time difference
        console.log('ping from client: ' + data.ping);  // show ping recieved from client
        console.log("ping in Millisecs: "+ total/2 + ' ms');    // show ping calculated 
                });
        });



