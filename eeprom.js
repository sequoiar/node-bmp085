var i2c = require('i2c');
var address = 0x77;
var wire = new i2c(address, {device: '/dev/i2c-1', debug: false}); // point to your i2c address, debug provides REPL interface


var eeprom = [];

// read out eeprom
wire.readBytes(0xaa, 22, function(err, res) {
  if (err) return console.log(err+',read failed');
  
  // result contains a buffer of bytes
  for (var i = 0; i < 11; i ++) {
    if (i > 2 && i < 6) 
        eeprom[i] = res.readUInt16BE(2*i);
    else
        eeprom[i] = res.readInt16BE(2*i);
    
    console.log(' '+eeprom[i]); 
  }
});

