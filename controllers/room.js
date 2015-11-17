// Load the required packages 
var Room = require('../models/Room');


// Create endpoint /api/rfid_tags/ for POSTS
exports.get_room_form = function(req, res) {
	res.render('rooms/new_room_form');
};


exports.get_edit_room_form = function(req, res) {
	Room.findById(req.body.room_id, function (err, room) {
		if (err)
			res.send(err);
		//res.json(rfid_tag);
		res.render('rooms/edit_room_form',{
			room_data: room
		});
	});
	
};

exports.post_room = function(req, res) {

	// Create new instance of the RFID_tag model
	var rooms = new Room();
	var headings = ['Tag ID', 'Reference', 'Location'];

	// Set the rfid_tags properties from POST data
	rooms.name = req.body.name;
	rooms.height = req.body.height;
	rooms.width = req.body.width;
	rooms.userId = req.user._id;

	// Save the RFID tag info and check for errors
	rooms.save(function(err) {
		if (err)
			res.send(err);
	});

	res.redirect('/rooms');
};


// Create endpoint /api/rfid_tags for GET 
exports.get_rooms = function(req, res) {

	var headings = ['Name', 'Height', 'Width'];
	// Use the rfid_tags model to find all the rfid_tags
	Room.find({userId: req.user._id},function (err, rooms) {
		if (err)
			res.send(err);
		console.log(rooms);
		//res.json(rfid_tags);
		res.render('rooms', {
			room_data : rooms,
			title : 'Room Data',
			heading : headings
		});
	});
};


// Create endpoint for /api/:rfid_tags for PUT
exports.edit_room = function(req, res) {
	// Use the rfid_tags model to modify rfid_tag
	Room.findById(req.body.room_id, function(err, room) {
		if (err)
			res.send(err);

		// Update the existing location (can modify to add anything)
		room.name = req.body.name;
		room.height = req.body.height;
		room.width = req.body.width;


		// Save the rfid_tag and check for errors
		room.save(function(err) {
			if (err)
				res.send(err);
			res.redirect('/rooms');
		});
	});
};


// Create endpoint /api/rfid_tags/:rfid_id for DELETE
exports.delete_room = function(req,res) {
	// Use the ID to delete a specific rfid_tag
	console.log('Tag Deleted: ' + req.body.room_id);
	Room.remove({ _id: req.body.room_id}, function(err) {
		
		if (err) {
			console.log('There is an error');
			res.send(err);
		}
		res.redirect('/rooms');
	});
};