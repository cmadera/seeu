'use strict';


// Shortcuts to DOM Elements.
var addMenuButton = document.getElementById('add-menu');

var inMenu    = document.getElementById('inMenu');
var inColor   = document.getElementById('inColor');
var inStatus  = document.getElementById('inStatus');
var inOrder  = document.getElementById('inOrder');

var ref = firebase.database().ref('thing');

splashPage.style.display = 'none';

// Bindings on load.
window.addEventListener('load', function() {

  addMenuButton.addEventListener('click', function() {
    var varItem = {
      menu: inMenu.value,
      color: inColor.value,
      status: inStatus.value,
      order: inOrder.value,
      dateModified : formatedToday(),

    };
    ref.push(varItem).then(snapshot => {
      addMenuOnScreen(varItem, snapshot.key);
    });
  });


  populateList();


}, false);

function populateList() {
  ref.on('value', snapshot => {
    snapshot.forEach(value => {
      addMenuOnScreen(value.val(), value.key);
    });
    ref.off('value');
  }, err => {
    console.log('erro no on', err);
  });
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

  tr.appendChild(createTD(data.menu));
  tr.appendChild(createTD(data.color));
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
