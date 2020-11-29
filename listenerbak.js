#!/usr/bin/env node
var noble = require('noble');
var Blynk = require('blynk-library');
var firebase = require('firebase');

var AUTH = 'khf8FvQsQCyB5A5SpYj_SYpdddhm_T3u';

var blynk = new Blynk.Blynk(AUTH, options = {
  connector : new Blynk.TcpClient()
});

// Firebase project configuration
var firebaseConfig = {
  apiKey: "AIzaSyCLU-hCjYlScrIZ9lNegLeWQWAf2wog-zI",
  authDomain: "iotproj-36b54.firebaseapp.com",
  databaseURL: "https://iotproj-36b54.firebaseio.com",
  projectId: "iotproj-36b54",
  storageBucket: "iotproj-36b54.appspot.com",
  messagingSenderId: "353757548712",
  appId: "1:353757548712:web:d2e28082ba2c9808a3f29d",
  measurementId: "G-ZR4J0E9T8H"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();




var pCount = 0;
var nCount = 0;
var btnPos = false;
var btnNeg = false;
var snaResult;
var dateTime;
var commState = false;
var socialState = false;
var analysis;

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
	    btnPos = true;
	  }
          if (d.data[0]==20) {
	    nCount = nCount + 1;
	    console.log('Negative Count: ', nCount);
	    btnNeg = true;
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
      analysis = "Communications";
    }
    v2.on('read', function() {
      if ((commState  == true) && (btnPos == true)) {
        console.log("Update pCount - ", commState);
	var now = new Date();
	var date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
	var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	dateTime = date+' '+time;
	snaResult = "Positive";
        v2.write(pCount);
	btnPos = false;
	addRecord(dateTime, analysis, snaResult);
      }
    });
    // Communications negative
    v3.on('read', function() {
      if ((commState == true) && (btnNeg == true)) {
        console.log("Update nCount - ", commState);
	var now = new Date();
	var date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
	var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	dateTime = date+' '+time;
        snaResult = "Negative";
        v3.write(nCount);
	btnNeg = false;
	addRecord(dateTime, analysis, snaResult);
      }
    });
  }
  else {
    commState = false;
    console.log("Comms button switched off, commState: ", commState);

    v2.on('read', function() {
      if (commState  == false) {
        console.log("Comms Off Set pCount to zero ");
        v2.write(0);
	btnPos = false;
      }
    });
    // Communications negative
    v3.on('read', function() {
      if (commState == false) {
        console.log("Comms Off Set nCount to zero ", commState);
        v3.write(0);
	btnNeg = false;
      }
    })
  }
console.log("Exiting communtications if");
});


// Social Skills button
v4.on('write', function(param) {
  console.log('V4 Social Skills: ', param[0]);
  if (param[0] == 1) {
    // Social Skills positive
    if ((socialState == false) && (param[0] == 1)) {  // button switched on, reset counters
      console.log("Reset Counter, set social state to true");
      socialState = true;
      pCount = 0;
      nCount = 0;
      analysis = "Social Skills";
    }
    v5.on('read', function() {
      if ((socialState  == true) && (btnPos == true)) {
        console.log("Update pCount - ", socialState);
	var now = new Date();
	var date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
	var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	dateTime = date+' '+time;
	snaResult = "Positive";
        v5.write(pCount);
	btnPos = false;
	addRecord(dateTime, analysis, snaResult);
      }
    });
    // Social Skills negative
    v6.on('read', function() {
      if ((socialState == true) && (btnNeg == true)) {
        console.log("Update nCount - ", socialState);
	var now = new Date();
	var date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
	var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	dateTime = date+' '+time;
        snaResult = "Negative";
        v6.write(nCount);
	btnNeg = false;
	addRecord(dateTime, analysis, snaResult);
      }
    });
  }
  else {
    socialState = false;
    console.log("Social button switched off, socialState: ", socialState);

    v5.on('read', function() {
      if (socialState  == false) {
        console.log("Social button off set pCount to zero ");
        v5.write(0);
	btnPos = false;
      }
    });
    // Social Skills negative
    v6.on('read', function() {
      if (socialState == false) {
        console.log("Social button off set nCount to zero");
        v6.write(0);
	btnNeg = false;
      }
    })
  }
console.log("Exiting social skills if");
});





function addRecord(dateTime, analysis, snaResult) {
  console.log("Sending record to firebase database");
  firebase.database().ref('results/').push({
    recordDate: dateTime,
    analysisType: analysis,
    result: snaResult
  });
  pushResult = false;
 }






v8.on('write', function(param) {
  console.log('V8:', param[0]);
});

v9.on('read', function() {
  v9.write(new Date().getSeconds());
});

