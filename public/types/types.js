'use strict';

// Shortcuts to DOM Elements.
var addMenuButton = document.getElementById('add-menu');

var inName    = document.getElementById('inName');
var inStatus  = document.getElementById('inStatus');
var inOrder  = document.getElementById('inOrder');

var ref;

var currentUID;
var populated = false;

function onAuthStateChanged(user) {
  if (user && currentUID === user.uid) return;
  currentUID = (user)?user.uid:null;

  ref = firebase.database().ref('types/'+currentUID);
  populateList();

}


// Bindings on load.
window.addEventListener('load', function() {

  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  addMenuButton.addEventListener('click', function() {
    var varItem = {
      name: inName.value,
      status: inStatus.value,
      order: inOrder.value,
      dateModified : formatedToday(),

    };
    ref.push(varItem).then(snapshot => {
      addMenuOnScreen(varItem, snapshot.key);
    });
  });
}, false);

function populateList() {
  if (currentUID!=null && !populated) {
    ref.on('value', snapshot => {
      snapshot.forEach(value => {
        addMenuOnScreen(value.val(), value.key);
      });
      ref.off('value');
      populated = true;
    }, err => {
      console.log('erro no on', err);
    });
  } else {
    //alert('Oops');
  }
}

function deleteItem(key) {
  ref.child(key).remove().then(() => {
      document.getElementById(key).style.display = 'none';
  });
   
}

function addMenuOnScreen(data, key) {
  let tbody = document.getElementById("menuTable");
  var tr = document.createElement("tr");
  tr.setAttribute('id', key);

  tr.appendChild(createTD(data.name));
  tr.appendChild(createTD(data.status));
  tr.appendChild(createTD(data.order));
  var td = document.createElement("td");
  var btnDelete = document.createElement('button');
  btnDelete.className = "mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--accent";
  btnDelete.setAttribute('onclick', 'deleteItem("'+key+'");');
  btnDelete.appendChild(createIcon("delete"));
  td.appendChild(btnDelete);

  tr.appendChild(td);
  tbody.appendChild(tr);
}

function createIcon(icon) {
  var i = document.createElement("i");
  i.className="material-icons";
  var t = document.createTextNode(icon);
  i.appendChild(t);
  return i;
}

function createTD(txt) {
  var td = document.createElement("td");
  td.appendChild(document.createTextNode(txt));
  return td;
}

function formatedToday() { 
  var d = new Date();
  return  d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
}
