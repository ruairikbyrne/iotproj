#!/usr/bin/env node
var noble = require('noble');
var Blynk = require('blynk-library');

var AUTH = 'khf8FvQsQCyB5A5SpYj_SYpdddhm_T3u';

var blynk = new Blynk.Blynk(AUTH, options = {
  connector : new Blynk.TcpClient()
});

var pCount = 0;
var nCount = 0;
var commState = false;
var socialState = false;

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        noble.startScanning([], true);
    } else {
        noble.stopScanning();
    }
});

var lastData = {};
noble.on('discover', function(peripheral) {
    // console.log("----------------");
    // console.log(peripheral);
    var data = peripheral.advertisement.serviceData;
    lastData[peripheral.id] = lastData[peripheral.id]||{};

    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        if (lastData[peripheral.id][d.uuid] !== d.data[0]) {
            lastData[peripheral.id][d.uuid] = d.data[0];
            console.log(peripheral.id,d.uuid, d.data[0]);
          if (d.data[0]==10) {
	    pCount = pCount + 1;
	    console.log('Positive Count: ', pCount);
	  }
          if (d.data[0]==20) {
	    nCount = nCount + 1;
	    console.log('Negative Count: ', nCount);
	  }
	}


    }

});

var v1 = new blynk.VirtualPin(1);  // Communications button
var v2 = new blynk.VirtualPin(2);  // Communications positive output
var v3 = new blynk.VirtualPin(3);  // Communications negative output
var v4 = new blynk.VirtualPin(4);  // Social skills button
var v5 = new blynk.VirtualPin(5);  // Social skills positive output
var v6 = new blynk.VirtualPin(6);  // Social skills negative output
var v8 = new blynk.VirtualPin(8);
var v9 = new blynk.VirtualPin(9);

// Communications button
v1.on('write', function(param) {
  console.log('V1 Communications: ', param[0]);
  if (param[0] == 1) {
    // Communications positive
    if ((commState == false) && (param[0] ==1)) {  // button switched on, reset counters
      console.log("Reset Counter, set comm state to true");
      commState = true;
      pCount = 0;
      nCount = 0;
    }
    console.log("Comm state before writeback - ", commState);

    v2.on('read', function() {
      if (commState  == true) {
        console.log("Update pCount - ", commState);
        v2.write(pCount);
      }
    });

    // Communications negative
    v3.on('read', function() {
      if (commState == true) {
        console.log("Update nCount, commState - ", commState);
        v3.write(nCount);
      }
    });
    
  }
  else {
    commState = false;
    console.log("Comms button switched off, commState: ", commState);

    v2.on('read', function() {
      if (commState  == false) {
        console.log("Update pCount - ", commState);
        v2.write(0);
      }
    });

    // Communications negative
    v3.on('read', function() {
      if (commState == false) {
        console.log("Update nCount, commState - ", commState);
        v3.write(0);
      }
    })

  }
});





// Social skills button

v4.on('write', function(param) {
  console.log('V4 Social Skills: ', param[0]);
  if (param[0] == 1) {
    // Social  positive
    if ((socialState == false) && (param[0] ==1)) {  // button switched on, reset counters
      console.log("Reset Counter, set social state to true");
      socialState = true;
      pCount = 0;
      nCount = 0;
    }
    console.log("Social state before writeback - ", socialState);

    v5.on('read', function() {
      if (socialState  == true) {
        console.log("Update pCount - ", socialState);
        v5.write(pCount);
      }
    });

    // Social negative
    v6.on('read', function() {
      if (socialState == true) {
        console.log("Update nCount, socialState - ", socialState);
        v6.write(nCount);
      }
    });
    
  }
  else {
    socialState = false;
    console.log("Social skills button switched off, socialState: ", socialState);

    v5.on('read', function() {
      if (socialState  == false) {
        console.log("Update pCount - ", socialState);
        v5.write(0);
      }
    });

    // Social negative
    v6.on('read', function() {
      if (socialState == false) {
        console.log("Update nCount, socialState - ", socialState);
        v6.write(0);
      }
    })

  }
});



//v4.on('write', function(param) {
//  console.log('V4 Social Skills: ', param[0]);
//});

//// Social skills positive
//v5.on('read', function() {
//  v5.write('Positive Social');
//});

//// Social skills negative
//v6.on('read', function() {
//  v6.write('Negative Socail');
//});


v8.on('write', function(param) {
  console.log('V8:', param[0]);
});

v9.on('read', function() {
  v9.write(new Date().getSeconds());
});

