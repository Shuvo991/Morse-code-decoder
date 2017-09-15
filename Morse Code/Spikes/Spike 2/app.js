//This spike is a demo on how to use firebase and Beaglebone-io
//to get data from a PIR motion sensor and upload it to a could database.

var bbb = require('beaglebone-io');     // calling the library
var board = new bbb();

var admin = require("firebase-admin");  // calling firebase library
var serviceAccount = require("./firebaseKey.json");     // this is ur auth key
// Establishing  connection using the auth key and database link
admin.initializeApp({credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spike2-a42d2.firebaseio.com/"});
var db = admin.database();      //using the database service
var ref = db.ref("/sensorData/state");  //accessing the child 'state' in DB


board.on('ready',function(){
  var pin = 'P8_11';                     // PIR input pin
  this.pinMode(pin,this.MODES.INPUT);           //Initiating as an input

        this.digitalRead(pin,function(data){    // probing the PIR
        var time = Date.now();          //getting current system time
        var end;                        //to store the trasmission duration

        // send state to database
        ref.set(data,function(error){
                if(error){              // conection issue
                  alert("something went wrong!"+error);}
                else{ end = Date.now() - time;
        if (data==0){console.log("State: LOW " + "timestamp: "+time);}
        else{console.log("State: HIGH " + "timestamp: "+time);}
        console.log('Ping: '+end/2+' ms');}});     // print out the ping in ms
        });
        });

