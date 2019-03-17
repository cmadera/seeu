const os = require('os-utils');
const https = require('https');
const schedule = require('node-schedule');


const userID="YWjFFLuN4aYMf7lwXa4ASHWFkLn2";
const thingid="-La7dhH9xRkhD-HvEx1L";
const hostname = "us-central1-seeume-15d54.cloudfunctions.net";
 
schedule.scheduleJob('* * * * *', function(){
	console.log('\nSending data...'+getDateTime());
	sendData();
});

function sendData() {
	const data = getData();

	const options = {
	  hostname: hostname,
	  port: 443,
	  path: '/monitor?currentUID=' + userID + '\&thingid=' + thingid,
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	    'Content-Length': data.length
	  }
	}

	const req = https.request(options, (res) => {
		console.log(`statusCode: ${res.statusCode}`);

		res.on('data', (d) => {
			process.stdout.write(d)
		})
	})

	req.on('error', (error) => {
		console.error(error)
	})

	req.write(data)
	req.end()
}

function getData() {
 return '{"OSVersion":"'+os.platform()+'", '+
	'"CPU":"'+os.cpuCount()+'", '+
	'"RAM":"'+Math.round(os.totalmem())+'", '+
	'"UPTIME":"'+secondsToDhms(os.sysUptime())+'"}';
}

function getTime() {
	var today = new Date();
	var hour = today.getHours() + "";
	var minutes = today.getMinutes() + "";
	var seconds = today.getSeconds() + "";
	hour = checkZero(hour);
	mintues = checkZero(minutes);
	seconds = checkZero(seconds);

	return (hour + ":" + minutes + ":" + seconds);
}

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

function secondsToDhms(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600*24));
	var h = Math.floor(seconds % (3600*24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 3600 % 60);

	var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " h, " : " hs, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " m, " : " m, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return dDisplay + hDisplay + mDisplay; // + sDisplay;
}
