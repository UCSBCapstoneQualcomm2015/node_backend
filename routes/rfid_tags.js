// Load the required packages 
var Rfid = require('../models/rfid_tags');


// Create endpoint /api/rfid_tags/ for POSTS
exports.postRfid_tags = function(req, res) {

	// Create new instance of the RFID_tag model
	var rfid_tags = new Rfid();

	// Set the rfid_tags properties from POST data
	rfid_tags.tagId = req.body.tagId;
	rfid_tags.readerId = req.body.readerId;
	rfid_tags.location = req.body.location;
	rfid_tags.reference = req.body.reference;
	rfid_tags.userId = req.user._id;

	// Save the RFID tag info and check for errors
	rfid_tags.save(function(err) {
		//if (err)
			//res.send(err);

		res.json({ message: 'RFID tag added to the database ', data: rfid_tags });
	});
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
	Rfid.findById(req.params.rfid_tag_id, function(err, rfid_tag) {
		if (err)
			res.send(err);

		// Update the existing location (can modify to add anything)
		rfid_tag.location = req.body.location;

		// Save the rfid_tag and check for errors
		rfid_tag.save(function(err) {
			if (err)
				res.send(err);
			res.json(rfid_tag);
		});
	});
};


// Create endpoint /api/rfid_tags/:rfid_id for DELETE
exports.deleteRfid_tag = function(req,res) {
	// Use the ID to delete a specific rfid_tag
	Rfid.remove({ _id: req.params.rfid_tag_id}, function(err) {
		if (err)
			res.send(err);
		res.json({message: 'RFID tag has been removed from the database'});
	});
};