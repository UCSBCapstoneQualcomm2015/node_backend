// Load the required packages 
var Rfid = require('../models/RFID');
var Room = require('../models/Room');
var Rfid_ref_tag = require('../models/RFID_ref');
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


exports.post_find_api = function(req, res) {
	//Store user ID
	var uID = req.params.user_id;
	//Remove all old user sniffing events
	UserEvent.remove({userId: uID}, function(err) {
		if (err) console.log('There is an error');
	});

	//Create a new user event
	var newEvent = new UserEvent();
	newEvent.userId = uID;
	newEvent.distances = [];

	// Save the event info and check for errors
	newEvent.save(function(err) {
		if (err)
			console.log(err);
	});

	//Create header options for connecting to snapdragon python servers
	var options = {
	  host: '192.168.1.104',
	  path: '/',
	  port: '8000',
	  //This is the only line that is new. `headers` is an object with the headers to request
	  headers: {'custom': 'Custom Header Demo works', 'objID': '4'}
	};

	//Create query to get room ID
	var roomQuery = Room.find({userId: uID, name: req.body.roomName});
	//roomQuery.select('_id');
	roomQuery.exec(function (err, roomToSearch) {
		//Store room ID for future nested queries
		var roomId = roomToSearch[0]._id;

		var roomLength = roomToSearch[0].length;
		var roomWidth = roomToSearch[0].width;
		//console.log("length: " + roomLength + " Width: " + roomWidth);
		//Create query for item ID
		var query = Rfid.find({userId: uID, name: req.body.name});
		query.select('tagId');
		query.exec(function (err, item) {
			//Create query for Snapdragon IP Addresses
		  	var query2 = SnapDragon.find({userId: uID, roomId: roomId});
		  	query2.exec(function (err, snapDragons) {
		  		//Store number of snapdragons within room to trigger event finished 
		  		console.log("snapdragons in this room: " + snapDragons);
		  		var snapCount = snapDragons.length;

		  		//Create query to acquire reference tag ids within the room
		  		var query3 = Rfid_ref_tag.find({userId: uID, roomId: roomId});
		  		//query3.select('tagId', 'xCoord', 'yCoord');
		  		query3.exec(function (err, refData) {
			  		console.log("reference tags in this room " + refData);
			  		var snapCallbackCount = 0;
			  		var currentIteration = 0;

					callback = function(response) {
					  var str = ''
					  response.on('data', function (chunk) { str += chunk; });

					  response.on('end', function () {
					  	//console.log(snapDragons[snapCallbackCount]['ipAddress'] + str);
						newEvent.distances.push(str);
						newEvent.save(function(err) {
					    	if (err){ console.log(err); return; }
				    	});

						snapCallbackCount += 1;

						if (snapCallbackCount >= snapCount) {
							console.log('All responses from SnapDragons received.');

							//Build formatted input for algorithm
							var algData = '{"snaps": [';
							for(var i = 0; i < snapCount; i++) {
								snapResponse = JSON.parse(newEvent.distances[i]);
								snapResponse['xCoord'] = snapDragons[i]['xCoord'];
								snapResponse['yCoord'] = snapDragons[i]['yCoord'];
								algData += JSON.stringify(snapResponse);

								if (i != snapCount - 1) algData += ',';
							} algData += "]}";

							var refTagData = '{"tags" : [';
							for(var i = 0; i < refData.length; i++){
								refTagData += '{"id":' + "\"" + refData[i].tagId + "\",";
								refTagData +=  '"xCoord":' + "\"" + refData[i].xCoord + "\",";
								refTagData +=  '"yCoord":' + "\"" + refData[i].yCoord + "\"}";
								if (i != refData.length - 1) refTagData += ',';
							}
							refTagData += ']}';

							itemString = item[0].tagId;


							console.log("Algorithm String: " + algData);
							console.log("Item ID: " +  itemString);
							console.log("Reference Tag Data: " + refTagData);


							var python_options = {
							  args: [algData, itemString, refTagData]
							};

							var xCoord, yCoord, message = "";
							 
							PythonShell.run('algorithm.py', python_options, function (err, results) {
							  if (err) { 
							  	message = "Error running algorithm: ";
							  	console.log(message + err);
							  } else {
							  	message = results[0];
							  }

							  // results is an array consisting of messages collected during execution 
							  console.log('results: ', results);

							  //TODO: Replace with actual algorithm output
							  myObj = JSON.parse(message);
							  console.log('myObj: ', myObj);
							  console.log(myObj['xCoord']);
							  console.log(myObj['yCoord']);

							  res.json({ xCoord: myObj['xCoord'], yCoord: myObj['yCoord'] });
							});
						}
						else {
							options['host'] = snapDragons[snapCallbackCount]['ipAddress'];
							var req = http.request(options, callback);
							req.on('error', function(err) {
							    // Handle error
							});
							req.end();
						}
					  });
					}

					//for(var i = 0; i < snapCount; i++) {
					options['host'] = snapDragons[snapCallbackCount]['ipAddress'];

					var req = http.request(options, callback);
					req.on('error', function(err) {
					    // Handle error
					});
					req.end();
					//}
			  	});
		  	});
		});
	});	
}

