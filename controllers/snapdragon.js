// Load the required packages 
var SnapDragon = require('../models/SnapDragon');

// Create endpoint /api/rfid_tags for GET 
exports.get_snapdragons = function(req, res) {

	var headings = ['Room', 'IP Address'];
	// Use the rfid_tags model to find all the rfid_tags
	SnapDragon.find({userId: req.user._id},function (err, snapdragons) {
		if (err)
			res.send(err);

		//res.json(rfid_tags);
		res.render('snapdragons', {
			snapdragon_data : snapdragons,
			title : 'Snap Dragon Data',
			heading : headings
		});
	});
};

// Create endpoint /api/rfid_tags/:rfid_id for DELETE
exports.delete_snapdragon = function(req,res) {
	// Use the ID to delete a specific rfid_tag
	SnapDragon.remove({ _id: req.body.snapdragon_id}, function(err) {
		
		if (err) {
			console.log('There is an error');
			res.send(err);
		}
		res.redirect('/snapdragons');
	});
};

// Create endpoint /api/rfid_tags/ for POSTS
exports.get_snapdragon_form = function(req, res) {
	res.render('snapdragons/new_snapdragon_form');
};

exports.get_edit_snapdragon_form = function(req, res) {
	SnapDragon.findById(req.body.snapdragon_id, function (err, snapdragon) {
		if (err)
			res.send(err);
		//res.json(rfid_tag);
		res.render('snapdragons/edit_snapdragon_form',{
			snapdragon_data: snapdragon
		});
	});	
};


exports.post_snapdragon = function(req, res) {

	// Create new instance of the RFID_tag model
	var snapdragons = new SnapDragon();
	var headings = ['Room Id', 'IP Address'];

	// Set the rfid_tags properties from POST data
	snapdragons.roomId = req.body.roomId;
	snapdragons.ipAddress = req.body.ipAddress;
	snapdragons.userId = req.user._id;


	// Save the RFID tag info and check for errors
	snapdragons.save(function(err) {
		if (err)
			res.send(err);
	});

	res.redirect('/snapdragons');
};

// Create endpoint for /api/:rfid_tags for PUT
exports.edit_snapdragon = function(req, res) {
	// Use the rfid_tags model to modify rfid_tag
	SnapDragon.findById(req.body.snapdragon_id, function(err, snapdragon) {
		if (err)
			res.send(err);

		// Update the existing location (can modify to add anything)
		snapdragon.roomId = req.body.name;
		snapdragon.ipAddress = req.body.height;



		// Save the rfid_tag and check for errors
		room.save(function(err) {
			if (err)
				res.send(err);
			res.redirect('/snapdragons');
		});
	});
};





