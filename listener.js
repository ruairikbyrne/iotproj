#!/usr/bin/env node
var noble = require('noble');
var Blynk = require('blynk-library');

var AUTH = 'khf8FvQsQCyB5A5SpYj_SYpdddhm_T3u';

var blynk = new Blynk.Blynk(AUTH, options = {
  connector : new Blynk.TcpClient()
});

var pCount = 0;
var nCount = 0;

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

var v1 = new blynk.VirtualPin(1);
var v2 = new blynk.VirtualPin(2);
var v3 = new blynk.VirtualPin(3);
var v4 = new blynk.VirtualPin(4)
var v5 = new blynk.VirtualPin(5)
var v6 = new blynk.VirtualPin(6);
var v8 = new blynk.VirtualPin(8);
var v9 = new blynk.VirtualPin(9);

v1.on('write', function(param) {
  console.log('V1 Communications: ', param[0]);
});


v2.on('read', function() {
  v2.write(pCount);
});


v3.on('read', function() {
  v3.write(nCount);
});


v4.on('write', function(param) {
  console.log('V4 Social Skills: ', param[0]);
});


v5.on('read', function() {
  v5.write('Positive Social');
});


v6.on('read', function() {
  v6.write('Negative Socail');
});



v8.on('write', function(param) {
  console.log('V8:', param[0]);
});

v9.on('read', function() {
  v9.write(new Date().getSeconds());
});

