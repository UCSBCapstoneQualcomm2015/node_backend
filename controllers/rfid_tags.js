// Load the required packages 
var Rfid = require('../models/RFID');


// Create endpoint /api/rfid_tags/ for POSTS
exports.getRfid_Tag_form = function(req, res) {
	res.render('rfid_tags/new_tag_form');
};


exports.getEdit_rfid_tag_form = function(req, res) {
	console.log('Tag to Edit: ' + req.body.rfid_tag_id);
	Rfid.findById(req.body.rfid_tag_id, function (err, rfid_tag) {
		if (err)
			res.send(err);
		//res.json(rfid_tag);
		res.render('rfid_tags/edit_tag_form',{
			tag_data: rfid_tag
		});
	});
	
};

exports.postRfid_tags = function(req, res) {

	// Create new instance of the RFID_tag model
	var rfid_tags = new Rfid();
	var headings = ['Tag ID', 'Reference', 'Location', 'Reader ID'];

	// Set the rfid_tags properties from POST data
	rfid_tags.tagId = req.body.tagId;
	rfid_tags.readerId = req.body.readerId;
	rfid_tags.location = req.body.location;
	rfid_tags.reference = req.body.reference;
	rfid_tags.userId = req.user._id;

	// Save the RFID tag info and check for errors
	rfid_tags.save(function(err) {
		if (err)
			res.send(err);
	});

	res.redirect('/rfidtags');
};


// Create endpoint /api/rfid_tags for GET 
exports.getRfid_tags = function(req, res) {

	var headings = ['Tag ID', 'Reference', 'Location', 'Reader ID'];
	// Use the rfid_tags model to find all the rfid_tags
	Rfid.find(function (err, rfid_tags) {
		if (err)
			res.send(err);

		//res.json(rfid_tags);
		res.render('rfid_tags', {
			data_rfidTags : rfid_tags,
			title : 'All User Tags',
			heading : headings
		});
	});
};

// Create endpoint for /api/:rfid_tags for GET
exports.getRfid_tag = function(req, res) {
	// Use the rfid_tags model to get a specific rfid_tag
	Rfid.findById(req.params.rfid_tag_id, function (err, rfid_tag) {
		if (err)
			res.send(err);
		res.json(rfid_tag);
	});
};


// Create endpoint for /api/:rfid_tags for PUT
exports.putRfid_tag = function(req, res) {
	// Use the rfid_tags model to modify rfid_tag
	Rfid.findById(req.body.rfid_tag_id, function(err, rfid_tag) {
		if (err)
			res.send(err);

		// Update the existing location (can modify to add anything)
		rfid_tag.tagId = req.body.tagId;
		rfid_tag.location = req.body.location;
		rfid_tag.reference = req.body.reference;
		rfid_tag.readerId = req.body.readerId;

		// Save the rfid_tag and check for errors
		rfid_tag.save(function(err) {
			if (err)
				res.send(err);
			res.redirect('/rfidtags');
		});
	});
};


// Create endpoint /api/rfid_tags/:rfid_id for DELETE
exports.deleteRfid_tag = function(req,res) {
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