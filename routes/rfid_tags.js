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

	// Save the RFID tag info and check for errors
	rfid_tags.save(function(err) {
		if (err)
			res.send(err);

		res.json({ message: 'RFID tag added to the database ', data: rfid_tags });
	});
};


// Create endpoint /api/rfid_tags for GET 
exports.getRfid_tags = function(req, res) {

	// Use the rfid_tags model to find all the rfid_tags
	Rfid.find(function (err, rfid_tags) {
		if (err)
			res.send(err);

		res.json(rfid_tags);
	});
};