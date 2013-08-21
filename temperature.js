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

  // measure temprature
  wire.writeBytes(0xf4, [0x2e], function(err){
      if (err) return console.log(err+',write failed');

      setTimeout(function(){
          // read out temperature
          wire.readBytes(0xf6, 2, function(err, res){
              if (err) return console.log(err+',read failed');

              var ut = res.readUInt16BE(0);
              ///var ut = (res[0] << 8) | res[1];
              
              console.log('raw temperature data:'+ut);

              var x1, x2, b5, t;

              x1 = (ut-eeprom[5])*eeprom[4]/0x8000;
              x2 = (eeprom[9] * 0x800) / (x1 + eeprom[10]);
              b5 = x1 + x2;
              t = (b5 + 8) / 16.0;

              console.log('x1:'+x1);
              console.log('x2:'+x2);
              console.log('b5:'+b5);
              console.log('t:'+t);

          });
      }, 10); // waiting 10ms
  });
});

