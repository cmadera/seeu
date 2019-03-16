'use strict';

// Shortcuts to DOM Elements.
var connected = document.getElementById('connected');

var currentUID;

function onAuthStateChanged(user) {
  if (user && currentUID === user.uid) return;
  currentUID = (user)?user.uid:null;

  if (currentUID!=null) {
    connected.innerHTML  = "<br><table>"+
    "<tr><td>User Name: </td><td><b>"+ user.displayName + "</b></td></tr>" +
    "<tr><td>E-Mail: </td><td><b>"+ user.email + "</b></td></tr>" +
    "<tr><td>currentUID: </td><td><b>"+ user.uid + "</b></td></tr>" +
    "</table>";
      
  } else {
    connected.textContent  = 'Not logged in';
  }

}

// Bindings on load.
window.addEventListener('load', function() {

  firebase.auth().onAuthStateChanged(onAuthStateChanged);

}, false);
