const assert = require('chai').assert;
const readSignal = require('../app').readSignal;

describe('app',function(){
  var state = 1;
  var pirCounter;
  var done = true;
  var resCounter;

  var result;
  it('should detect a long ', function(){
        var passData = setInterval(function(){
        result = readSignal(state,done);  },1000,pirCounter,result,done,resCounter);
        if (result != undefined){ clearInterval(passData);
        assert (result == 'S', ' Final result is not equal to L');
        }});
  resCounter = 0;
  pirCounter = 0;
  done = true;
  result = undefined;
  it('should detect a short ', function(){
        var passData1 = setInterval(function(){
        if(pirCounter == 2){state = 0;}
        result = readSignal(state,done);  },1000,pirCounter,result,done,resCounter);
        if (result != undefined){ clearInterval(passData1);
        assert (result == 'S', ' Final result is not equal to S');
        }});

  it('should detect a null ', function(){
        result = readSignal(state,done);
        assert (result == undefined, ' Final result is not equal to undefined');
        });


});


