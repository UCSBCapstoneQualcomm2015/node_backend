// Load the required packages 
var Rfid = require('../models/RFID');
var Room = require('../models/Room');
var SnapDragon = require('../models/SnapDragon');
var PythonShell = require('python-shell');



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
	var query = Rfid.find({userId: req.user._id, name: req.body.name});
	query.select('tagId');
	console.log(req.user._id + " " + req.body.roomName) 

	query.exec(function (err, item) {
	  	var query2 = SnapDragon.find({userId: req.user._id, roomId: req.body.roomName});
	  	query2.select('ipAddress');
	  	query2.exec(function(err, snapDragons){
	  		//res.json(item + snapDragons);
	  		var options = {
			};

			PythonShell.run('postToServer.py', options, function (err, results) {
			  if (err) console.log(err);
			  // results is an array consisting of messages collected during execution 
			  console.log('results: %j', results);
			});

			res.render('home');
	  	});
	});
}
