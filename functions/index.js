// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
let vesync = require('./vesync.js');
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.monitor = functions.https.onRequest((req, res) => {
  const thingid = req.query.thingid;
  const currentUID = req.query.currentUID;
  if (thingid==null)
    return res.status(400).json('[{"error":{"code":400,"status":"BAD_REQUEST","message":,"errors":["ThingID is missing"]}}]');

  if (currentUID==null)
    return res.status(400).json('[{"error":{"code":400,"status":"BAD_REQUEST","message":,"errors":["currentUID is missing"]}}]');

  // Get Thing database
  var ref = admin.database().ref('thing/'+currentUID+'/'+thingid);

  // Get Attributes Database
  var att = admin.database().ref('attribute/'+currentUID);

  // Check if User+Thing exist
  ref.on('value', snapshot => {
    if (snapshot.exists()) {
      // If Exist save lastSee
      ref.child('lastSee').set(getDateTime());

      // And loop Attributes and save what was found
      att.on('value', snap => {
        snap.forEach(value => {
          var attribute = value.val().name;
          var valor = eval("req.body."+attribute);
          if (valor != undefined) {
            //console.log('Att: ' + attribute + "=" + valor);
            ref.child(attribute).set(valor);
          } 
        });
        ref.off('value');
      }, err => {
        console.log('erro no on', err);
      });
    } else {
      // If not exist, error
      return res.status(400).json('[{"error":{"code":400,"status":"BAD_REQUEST","message":,"errors":["Thing \"'+ thingid + '\" not found for user \"'+ currentUID + '\""]}}]');
    }
    ref.off('value');
  }, err => {
    console.log('erro no on', err);
  });

  // Is everithing is OK, close the call 
  res.json('{"Thing":"'+ thingid + ', "status":"OK"}');
  /*
  const original = req.query.text;
  const text = req.body.text;
  var myJSON = JSON.stringify(req.body);
  res.json('[{"name":"SERVERNAME","value":"'+original+'", "thingid":"'+thingid+'", "text":"'+text+'"},'+myJSON+']');  
  */


});


exports.thing = functions.https.onRequest((req, res) => {
  const currentUID = req.query.currentUID;

  if (currentUID==null)
    return res.status(400).json('[{"error":{"code":400,"status":"BAD_REQUEST","message":,"errors":["currentUID is missing"]}}]');

  var ref = admin.database().ref('thing/'+currentUID);
  return ref.once("value").then (snapshot => {
    return res.status(200).json(snapshot.val());
  });
});

exports.ping = functions.https.onRequest((req, res) => {
  const currentUID = req.query.currentUID;

  if (currentUID==null)
    return res.status(400).json('[{"error":{"code":400,"status":"BAD_REQUEST","message":,"errors":["currentUID is missing"]}}]');

  // Get Thing database
  var ref = admin.database().ref('thing/'+currentUID);
  var ping = require('ping');

  console.log("Starting ping...");

  // Check if User+Thing exist
  ref.on('value', snapshot => {
    res.json('{"OKs":"'+ snapshot.numChildren() + ', "status":"OK"}');
    snapshot.forEach(value => {
      var host = value.val().address;
      ping.sys.probe(host, function(isAlive){
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        //if (isAlive)
        //  ref.child('pingalive').set(getDateTime());
        console.log(msg);
    });
  });
    ref.off('value');
  }, err => {
    console.log('erro no on', err);
  });


});

exports.IoTDevices= functions.https.onRequest((req, res) => {
  vesync.getDevices(res);
  //res.status(200).send([{"deviceName":"Lamp","deviceImg":"https://smartapi.vesync.com/v1/app/imgs/wifi/outlet/smart_wifi_outlet.png","cid":"35243d08-56b2-48da-a413-23b419d83ec6","deviceStatus":"on","connectionType":"wifi","connectionStatus":"online","deviceType":"wifi-switch-1.3","model":"wifi-switch","currentFirmVersion":"2.115"},{"deviceName":"Real TV","deviceImg":"https://smartapi.vesync.com/v1/app/imgs/wifi/outlet/smart_wifi_outlet.png","cid":"4151e41b-b96e-41b0-8187-af19f944119f","deviceStatus":"on","connectionType":"wifi","connectionStatus":"online","deviceType":"wifi-switch-1.3","model":"wifi-switch","currentFirmVersion":"2.115"},{"deviceName":"Desk","deviceImg":"https://smartapi.vesync.com/v1/app/imgs/wifi/outlet/smart_wifi_outlet.png","cid":"4e07edfb-d1ee-471d-8614-1dc4a7118d63","deviceStatus":"off","connectionType":"wifi","connectionStatus":"online","deviceType":"wifi-switch-1.3","model":"wifi-switch","currentFirmVersion":"2.115"}]);
});

exports.IoTDevicesON= functions.https.onRequest((req, res) => {
  const currentUID = req.query.currentUID;

  if (currentUID==null)
    return res.status(400).json('[{"error":{"code":400,"status":"BAD_REQUEST","message":,"errors":["currentUID is missing"]}}]');

  vesync.turn_on(currentUID);
  return res.status(200).json('[{"OK":{"code":200,"status":"OK"}}]');
});

exports.IoTDevicesOFF= functions.https.onRequest((req, res) => {
  const currentUID = req.query.currentUID;

  if (currentUID==null)
    return res.status(400).json('[{"error":{"code":400,"status":"BAD_REQUEST","message":,"errors":["currentUID is missing"]}}]');

  vesync.turn_off(currentUID);
  return res.status(200).json('[{"OK":{"code":200,"status":"OK"}}]');

});

function getDateTime() {
	var today = new Date();
	var day = today.getDate() + "";
	var month = (today.getMonth() + 1) + "";
	var year = today.getFullYear() + "";
	var hour = today.getHours() + "";
	var minutes = today.getMinutes() + "";
	var seconds = today.getSeconds() + "";

	day = checkZero(day);
	month = checkZero(month);
	year = checkZero(year);
	hour = checkZero(hour);
	mintues = checkZero(minutes);
	seconds = checkZero(seconds);

	return (day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds);
}

function checkZero(data){
	if(data.length == 1){ data = "0" + data;  }
	return data;
}
/*
exports.servers = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  res.json('[{"nome":"WWW","url":"bigbank.com.br","agent":"\/monitor.php","protocol":"https"}, {"nome":"SeeU","url":"seeu.me","agent":"\/monitor.php","protocol":"https"}, {"nome":"iSeeU","url":"i.seeu.me","agent":"\/monitor.php","protocol":"http"},{"nome":"devSeeU","url":"dev.seeu.me","agent":"\/monitor.php","protocol":"http"}, {"nome":"ThingsBoard SeeU","url":"thingsboard.seeu.me","agent":"\/monitor.php","protocol":"http"},{"nome":"MQTT","url":"mqtt.seeu.me","agent":"\/monitor.php","protocol":"http"}, {"nome":"eSSe","url":"www.esseregalos.com","agent":"\/monitor.php","protocol":"http"},  {"nome":"Utopias","url":"utopiasargentinas.com","agent":"\/monitor.php","protocol":"http"}]');
});


exports.monitor = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  res.json('[{"name":"SERVERNAME","value":"i.seeu.me"},{"name":"OS Version","value":"CentOS Linux release 7.6.1810 (Core)","mu":""},{"name":"CPUs","value":"2 (Intel(R) Xeon(R) CPU L5520 @ 2.27GHz)","mu":""},{"name":"RAM(Free)","value":"991MB (7%)","mu":""},{"name":"DISK:\/(Free)","value":"8GB (75%)","mu":""},{"name":"SSLEXPIRE","value":"N\/A","mu":""}]');
});

exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      return res.redirect(303, snapshot.ref.toString());
    });
  });

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });
    */