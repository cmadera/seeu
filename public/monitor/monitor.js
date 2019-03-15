'use strict';

let divGrid = document.getElementById("divGrid");

var ref;

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

  populateList();

}


function populateList() {
  if (currentUID!=null && !populated) {
    ref.on('value', snapshot => {
      snapshot.forEach(value => {
        addCardOnScreen(value.val(), value.key);
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
    let divCell = createDIV("mdl-cell mdl-cell--4-col");
    let divLayout = createDIV("android-content mdl-layout__content");
    let divShadow =  createDIV("mdl-card mdl-shadow--2dp");
    let divTitle  =  createDIV("mdl-card__title");

    let divText  =  createDIV("mdl-card__supporting-text", data.address);

    divTitle.appendChild(createIten("h2","mdl-card__title-text",data.name));
    divShadow.appendChild(divTitle);
    divShadow.appendChild(divText);
    divLayout.appendChild(divShadow);
    divCell.appendChild(divLayout);
    divGrid.appendChild(divCell);

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

/*
<div class="mdl-cell mdl-cell--4-col">
    <div class="android-content mdl-layout__content">
        <div class="mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">Welcome</h2>
            </div>
            <div class="mdl-card__supporting-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Get Started</a>
            </div>
            <div class="mdl-card__menu">
                <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                    <i class="material-icons">share</i>
                </button>
            </div>
        </div>
    </div>
</div>
*/