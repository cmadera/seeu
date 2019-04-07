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

    getDevices(currentUID);
}

function getDevices(currentUID) {
    var xmlhttp = new XMLHttpRequest();
    var url = "/IoTDevices?currentUID="+currentUID;
    
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            populateList(response);
        }
    };
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
};

function populateList(response) {
if (currentUID!=null && !populated) {
    for(var exKey in response) {
        console.log("key: "+exKey+", value: "+response[exKey].deviceName);
        addCardOnScreen(response[exKey]);
    }  
  } else {
    //alert('Oops');
  }
}

function addCardOnScreen(data) {
    let divCell = createDIV("mdl-cell mdl-cell--3-col mdl-shadow--2dp");
    let divLayout = createDIV("android-content mdl-layout__content");
    let divShadow =  createDIV("mdl-card mdl-shadow--8dp");
    let divTitle  =  createDIV("mdl-card__title");

    var table = document.createElement("table");
    table.className = "mdl-data-table mdl-js-data-table mdl-shadow--8dp";
    //table.setAttribute('border', '1');
//    table.appendChild(createTR("ThingID",key));
//    table.appendChild(createTR("Name",data.name));
    table.appendChild(createTR("Device Name",data.deviceName));
    table.appendChild(createTR("Device Status",data.deviceStatus));
    table.appendChild(createTR("Connection Status",data.connectionStatus));
    var tr = document.createElement("tr");
    tr.appendChild(createTD(data.deviceStatus=="on"?"Turn off":"Turn on", true));
    var td = document.createElement("td");
    var a = document.createElement("a");
    //a.setAttribute('class', 'signature');
    if (data.deviceStatus=="on") {
        a.setAttribute('href', '/IoTDeviceOFF?currentUID='+currentUID+'&deviceId='+data.cid);
    } else {
        a.setAttribute('href', '/IoTDeviceON?currentUID='+currentUID+'&deviceId='+data.cid);
    }
    var newText = document.createTextNode(data.deviceStatus=="on"?"Turn off":"Turn on");
    a.appendChild(newText);


    td.appendChild(a);
    tr.appendChild(td);
    table.appendChild(tr);
    //table.appendChild(createTR("Device ID",data.cid));

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
