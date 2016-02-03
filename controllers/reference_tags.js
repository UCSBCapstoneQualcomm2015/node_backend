/*

// Load the required packages 
var ReferenceTag = require('../models/ReferenceTag');


// Create endpoint /api/rfid_tags/ for POSTS
exports.get_reference_tag_form = function(req, res) {
	res.render('referencetags/new_tag_form');
};


exports.get_edit_reference_tag_form = function(req, res) {
	console.log('Tag to Edit: ' + req.body.reference_tag_id);
	ReferenceTag.findById(req.body.reference_tag_id, function (err, reference_tag) {
		if (err)
			res.send(err);
		//res.json(rfid_tag);
		res.render('referencetags/edit_tag_form',{
			tag_data: reference_tag
		});
	});
	
};

exports.post_reference_tags = function(req, res) {

	// Create new instance of the RFID_tag model
	var reference_tags = new Rfid();
	var headings = ['Tag ID', 'Room ID', 'Coordinates'];

	// Set the rfid_tags properties from POST data
	reference_tags.tagId = req.body.tagId;
	reference_tags.roomId = req.body.roomId;
	reference_tags.coordinates = req.body.coordinates

	// Save the RFID tag info and check for errors
	reference_tags.save(function(err) {
		if (err)
			res.send(err);
	});

	res.redirect('/referencetags');
};


// Create endpoint /api/rfid_tags for GET 
exports.get_reference_tags = function(req, res) {

	var headings = ['Tag ID', 'Room ID', 'Coordinates'];
	// Use the rfid_tags model to find all the rfid_tags
	ReferenceTag.find({userId: req.user._id},function (err, reference_tags) {
		if (err)
			res.send(err);

		//res.json(rfid_tags);
		res.render('referencetags', {
			data_rfidTags : reference_tags,
			title : 'All User Tags',
			heading : headings
		});
	});
};


// Create endpoint for /api/:rfid_tags for PUT
exports.edit_reference_tag = function(req, res) {
	// Use the rfid_tags model to modify rfid_tag
	ReferenceTag.findById(req.body.reference_tag_id, function(err, reference_tags) {
		if (err)
			res.send(err);

		// Update the existing location (can modify to add anything)
		reference_tags.tagId = req.body.tagId;
		reference_tags.name = req.body.name;

		// Save the rfid_tag and check for errors
		reference_tags.save(function(err) {
			if (err)
				res.send(err);
			res.redirect('/referencetags');
		});
	});
};


// Create endpoint /api/rfid_tags/:rfid_id for DELETE
exports.delete_reference_tag = function(req,res) {
	// Use the ID to delete a specific rfid_tag
	console.log('Tag Deleted: ' + req.body.rfid_tag_id);
	Rfid.remove({ _id: req.body.rfid_tag_id}, function(err) {
		
		if (err) {
			console.log('There is an error');
			res.send(err);
		}
		res.redirect('/rfidtags');
	});
};
*/