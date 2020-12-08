#!/usr/bin/env node
var noble = require('noble');
var Blynk = require('blynk-library');
var ThingSpeakClient = require('thingspeakclient');
var client = new ThingSpeakClient();
var myWriteKey = 'MN0X1W260ZN0WYHQ';
var channelId = 1248267;

var AUTH = 'khf8FvQsQCyB5A5SpYj_SYpdddhm_T3u';

var blynk = new Blynk.Blynk(AUTH, options = {
  connector : new Blynk.TcpClient()
});

//Connect to thingspeak channel
client.attachChannel(channelId, { writeKey: myWriteKey}, callBackThingspeak);


var pCount = 0;
var nCount = 0;
var btnPos = false;
var btnNeg = false;
var snaResult;
var dateTime;
var commState = false;
var socialState = false;
var analysis;

var eventDate;
var eventTime;
var eventWeek;
var eventMonth;
var eventYear;

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
	    snaResult = "Positive";
	    now = new Date();
	    eventDate = calcDate();
	    eventTime = calcTime();
	    eventWeek = now.getWeek();
	    eventMonth = now.getMonth()+1;
	    eventYear = now.getFullYear();
	    //console.log("Date: ", eventDate);
	    //console.log("Time: ", eventTime);
	    //console.log("Week: ", eventWeek);
	    //console.log("Month: ", eventMonth);
	    //console.log("Year: ", eventYear);
	    //console.log("Analysis: ", analysis);
	    addRecord(analysis, snaResult, eventDate, eventTime, eventWeek, eventMonth, eventYear);
	    btnPos = true;
	  }
          if (d.data[0]==20) {
	    nCount = nCount + 1;
	    console.log('Negative Count: ', nCount);
	    snaResult = "Negative";
	    now = new Date();
	    eventDate = calcDate();
	    eventTime = calcTime();
	    eventWeek = now.getWeek();
	    eventMonth = now.getMonth()+1;
	    eventYear = now.getFullYear();
	    //console.log("Date: ", eventDate);
	    //console.log("Time: ", eventTime);
	    //console.log("Week: ", eventWeek);
	    //console.log("Month: ", eventMonth);
	    //console.log("Year: ", eventYear);
	    //console.log("Analysis: ", analysis);
	    addRecord(analysis, snaResult, eventDate, eventTime, eventWeek, eventMonth, eventYear);
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


// Communications button
v1.on('write', function(param) {
  //console.log('V1 Communications: ', param[0]);
  if (param[0] == 1) {
    // Communications positive
    if ((commState == false) && (param[0] ==1)) {  // button switched on, reset counters
      //console.log("Reset Counter, set comm state to true");
      commState = true;
      pCount = 0;
      nCount = 0;
      analysis = "Communications";
    }
    v2.on('read', function() {
      if ((commState  == true) && (btnPos == true)) {
        //console.log("Update pCount - ", commState);
        v2.write(pCount);
	btnPos = false;
      }
    });
    // Communications negative
    v3.on('read', function() {
      if ((commState == true) && (btnNeg == true)) {
        //console.log("Update nCount - ", commState);
        v3.write(nCount);
	btnNeg = false;
      }
    });
  }
  else {
    commState = false;
    //console.log("Comms button switched off, commState: ", commState);

    v2.on('read', function() {
      if (commState  == false) {
        //console.log("Comms Off Set pCount to zero ");
        v2.write(0);
	btnPos = false;
      }
    });
    // Communications negative
    v3.on('read', function() {
      if (commState == false) {
        //console.log("Comms Off Set nCount to zero ", commState);
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
        v5.write(pCount);
	btnPos = false;
      }
    });
    // Social Skills negative
    v6.on('read', function() {
      if ((socialState == true) && (btnNeg == true)) {
        console.log("Update nCount - ", socialState);
        v6.write(nCount);
	btnNeg = false;
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


function calcDate() {
  var now = new Date();
  var dd = String(now.getDate()).padStart(2, '0');
  var mm = String(now.getMonth() + 1).padStart(2, '0');
  var yyyy = now.getFullYear();
  var calculatedDate = dd + '/' + mm + '/' + yyyy;
  return calculatedDate;
}

function calcTime() {
  var now = new Date();
  var hh = String(now.getHours()).padStart(2, '0');
  var mm = String(now.getMinutes()).padStart(2, '0');
  var ss = String(now.getSeconds()).padStart(2, '0');
  var calculatedTime = hh  + ":" + mm + ":" + ss;
  return calculatedTime;
}



function addRecord(analysis, snaResult, eventDate, eventTime, eventWeek, eventMonth, eventYear) {
  client.updateChannel(channelId, {field1: analysis, field2: snaResult, field3: eventDate, field4:eventTime, field5:eventWeek, 
	field6:eventMonth, field7:eventYear}, function(err, resp){
	if (!err && resp > 0) {
		console.log('update successfully. Entry number was: ' + resp);
	}
	else {
	  console.log(err);
	}
  });
 };


function callBackThingspeak(err, resp)
{
    if (!err && resp > 0) {
        console.log('Successfully. response was: ' + resp);
    }
    else {
      console.log(err);
    }
}


// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.net/how-to/javascript

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function() {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  return date.getFullYear();
}
