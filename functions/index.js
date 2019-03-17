// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

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