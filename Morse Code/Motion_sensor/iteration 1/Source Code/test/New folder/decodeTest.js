const assert = require('chai').assert;
const  morseTable = require('../app').morseTable;
describe('app',function(convertSignal){
    var result ;
    it('should decode to letter "D" ', function(){
        const convertSignal = require('../app').convertSignal;
        result = convertSignal('LSS',morseTable);
        assert (result == 'D', ' combination for D did not decode to D');
        });

});
