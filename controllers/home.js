// Load the required packages 
var Rfid = require('../models/RFID');
var Room = require('../models/Room');
var UserEvent = require('../models/UserEvent');
var SnapDragon = require('../models/SnapDragon');
var PythonShell = require('python-shell');
var request = require("request");
var http = require('http');
var events = require('events');
var eventEmitter = new events.EventEmitter();


exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

exports.getFind = function(req, res) {
	var query = Rfid.find({userId: req.user._id});
	query.select('name');

	query.exec(function (err, myItems) {
	  	var query2 = Room.find({userId: req.user._id});
	  	query2.select('name');
	  	query2.exec(function(err, myRooms){
	  		myRooms_data: myRooms
	  		//res.json(myItems + myRooms);
	  		res.render('find', {
				room_data : myRooms
			});
	  	});
	});
};


exports.postFind = function(req, res) {
	//Remove all old user sniffing events
	UserEvent.remove({userId: req.user._id}, function(err) {
		if (err) console.log('There is an error');
	});

	var query = Rfid.find({userId: req.user._id, name: req.body.name});
	query.select('tagId');
	console.log(req.user._id + " " + req.body.roomName) 

	query.exec(function (err, item) {
		console.log("item = " + item);

		var uID = req.user._id;
	  	var query2 = SnapDragon.find({userId: req.user._id, roomId: req.body.roomName});

	  	query2.select('ipAddress');

	  	query2.exec(function (err, snapDragons){
	  		console.log("snapdragons in this room: " + snapDragons);
	  		var snapCount = snapDragons.length;
	  		var snapCallbackCount = 0;

	  		var newEvent = new UserEvent();
			newEvent.userId = uID;
			newEvent.distances = [];

			// Save the event info and check for errors
			newEvent.save(function(err) {
				if (err)
					console.log(err);
			});

	  		var ports = ['10000','10001','8002','8003'];
			var options = {
			  host: '192.168.1.104',
			  path: '/',
			  port: '8080',
			  //This is the only line that is new. `headers` is an object with the headers to request
			  headers: {'custom': 'Custom Header Demo works', 'objID': '4'}
			};

			callback = function(response) {
			  var str = ''
			  response.on('data', function (chunk) {
			    str += chunk;
			  });
			  response.on('end', function () {
			    console.log(str);

				newEvent.distances.push(str);
				newEvent.save(function(err) {
			    	if (err){
			    		res.send(err);
			    		return;
			    	}
		    	});

				snapCallbackCount += 1;
				if (snapCallbackCount >= snapCount) {
					console.log('All responses from SnapDragons received. User = ' + uID);

					//TODO: CALL ALGORITHM HERE
					console.log("Event after receiving all: " + newEvent);

					newEvent.remove(function(err) {
						if (err) console.log('There is an error');
					});
				}
				

			  });
			}

			for(var i = 0; i < snapCount; i++) {
				console.log("Port = " + ports[i]);
				options['host'] = snapDragons[i]['ipAddress'];
				options['port'] = ports[i];
				var req = http.request(options, callback);
				req.on('error', function(err) {
				    // Handle error
				});
				req.end();

				//sleep(3000);
			}
			res.render('home');
	  	});
	});

}

