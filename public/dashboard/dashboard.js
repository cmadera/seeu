'use strict';

let divGrid = document.getElementById("divGrid");

var ref;
var att;

var currentUID;
var populated = false;

// Bindings on load.
window.addEventListener('load', function() {

  firebase.auth().onAuthStateChanged(onAuthStateChanged);
  
}, false);

function onAuthStateChanged(user) {
  if (user && currentUID === user.uid) return;
  currentUID = (user)?user.uid:null;

  ref = firebase.database().ref('thing/'+currentUID);
  att = firebase.database().ref('attribute/'+currentUID);

  populateList();

}


function populateList() {
  if (currentUID!=null && !populated) {
    ref.on('value', snapshot => {
      snapshot.forEach(value => {
        //addCardOnScreen(value.val(), value.key);
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

function addCardOnScreen(data, key) {
    let divCell = createDIV("mdl-cell mdl-cell--3-col mdl-shadow--2dp");
    let divLayout = createDIV("android-content mdl-layout__content");
    let divShadow =  createDIV("mdl-card mdl-shadow--8dp");
    let divTitle  =  createDIV("mdl-card__title");

    var table = document.createElement("table");
    table.className = "mdl-data-table mdl-js-data-table mdl-shadow--8dp";
    table.appendChild(createTR("Address",data.address));
    att.on('value', snap => {
        snap.forEach(value => {
            var attribute = value.val().name;
            var unit = value.val().unit;
            var valor = eval("data."+attribute);
            if (valor != undefined) {
                console.log('Att: ' + attribute + "=" + valor);
                table.appendChild(createTR(attribute,valor + (unit==null?"":" "+ unit)));
            }
        });
        ref.off('value');
    }, err => {
        console.log('erro no on', err);
    });
  

    var divTable = document.createElement("div");
    divTable.className = "mdl-card__supporting-text";
    divTable.appendChild(table);

    divTitle.appendChild(createIten("h2","mdl-card__title-text",data.name));
    divShadow.appendChild(divTitle);
    divShadow.appendChild(divTable);
    divLayout.appendChild(divShadow);
    divCell.appendChild(divLayout);
    divGrid.appendChild(divCell);

}

function createTR(name, value) {
    var tr = document.createElement("tr");
    tr.appendChild(createTD(name, true));
    tr.appendChild(createTD(value));
    return tr;
}
  
function createTD(txt, bold) {
    var td = document.createElement("td");
    if (bold) {
        var b = document.createElement("b");
        b.appendChild(document.createTextNode(txt));
        td.appendChild(b);
    } else 
        td.appendChild(document.createTextNode(txt));
    return td;
}

function createIten(iten, className, txt) {
    var div = document.createElement(iten);
    div.className = className;
    if (txt!=null) {
        div.appendChild(document.createTextNode(txt));
    }    
    return div;
}

function createDIV(className, txt) {
    var div = document.createElement("div");
    div.className = className;
    if (txt!=null) {
        div.appendChild(document.createTextNode(txt));
    }    
    return div;
}

function formatedToday() { 
  var d = new Date();
  return  d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
}
