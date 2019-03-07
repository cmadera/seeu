// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp();

exports.servers = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  res.json('[{"nome":"WWW","url":"bigbank.com.br","agent":"\/monitor.php","protocol":"https"}, {"nome":"SeeU","url":"seeu.me","agent":"\/monitor.php","protocol":"https"}, {"nome":"iSeeU","url":"i.seeu.me","agent":"\/monitor.php","protocol":"http"},{"nome":"devSeeU","url":"dev.seeu.me","agent":"\/monitor.php","protocol":"http"}, {"nome":"ThingsBoard SeeU","url":"thingsboard.seeu.me","agent":"\/monitor.php","protocol":"http"},{"nome":"MQTT","url":"mqtt.seeu.me","agent":"\/monitor.php","protocol":"http"}, {"nome":"eSSe","url":"www.esseregalos.com","agent":"\/monitor.php","protocol":"http"},  {"nome":"Utopias","url":"utopiasargentinas.com","agent":"\/monitor.php","protocol":"http"}]');
});

exports.monitor = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  res.json('[{"name":"SERVERNAME","value":"i.seeu.me"},{"name":"OS Version","value":"CentOS Linux release 7.6.1810 (Core)","mu":""},{"name":"CPUs","value":"2 (Intel(R) Xeon(R) CPU L5520 @ 2.27GHz)","mu":""},{"name":"RAM(Free)","value":"991MB (7%)","mu":""},{"name":"DISK:\/(Free)","value":"8GB (75%)","mu":""},{"name":"SSLEXPIRE","value":"N\/A","mu":""}]');
});
/*
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