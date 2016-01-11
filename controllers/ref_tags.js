// Load the required packages
var Rfid_ref_tag = require('../models/RFID_ref');

// Controllers for the web app endpoints 
// 	- Controller 				-Jade Files 				-URL directed to
//---------------------------------------------------------------------------
//	- get_ref_form 				-rfid_tags/new_ref_tag_form		- /rfidtags/ref/new_tag_form
// 	- get_edit_ref_form			-rfid_tags/edit_ref_tag_form 	- /rfidtags/edit_ref_tag_form_in
// 	- get_ref_tags 				-ref_tags 						- /rfidtags/ref_tags
// 	- post_ref_tag				-								- /rfidtags/ref_tags
//  - edit_ref_tag				-								- /rfidtags/ref_tags
// 	- delete_ref_tag 			-								- /rfidtags/ref_tags

exports.get_ref_form = function(req, res) {
	res.render('rfid_tags/new_ref_tag_form');
};

exports.get_edit_ref_form = function(req,res) {

	Rfid_ref_tag.findById(req.params.ref_tag_id, function(err, ref_tag) {
		if (err)
			res.send(err);
		res.render('rfid_tags/edit_ref_tag_form', {
			ref_tag_data: ref_tag
		});

	});
};

exports.post_ref_tag = function(req, res) {
	var ref_tag = new Rfid_ref_tag();
	// Inormation from the body
	ref_tag.tagId = req.body.tagId;
	ref_tag.roomId = req.body.roomId;
	ref_tag.userId = req.user._id;
	ref_tag.x_position = req.body.x_position;
	ref_tag.y_position = req.body.y_position;

	ref_tag.save(function(err) {
		if (err) 
			res.send(err);
	});

	res.redirect('/rfidtags/ref_tag');
};

exports.edit_ref_tag = function(req, res) {

	Rfid_ref_tag.findById(req.body.ref_tag_id, function(err, ref_tag) {
		if (err)
			res.send(err);
		// Editable ref_tag data
		ref_tag.tagId = req.body.tagId;
		ref_tag.roomId = req.body.roomId;
		ref_tag.x_position = req.body.x_position;
		ref_tag.y_position = req.body.y_position;
		// Save the data and redirect
		ref_tag.save(function(err) {
			if (err) 
				res.send(err);
			res.redirect('/rfidtags/ref_tag');
		});
	});
};

exports.get_ref_tags = function(req, res) {
	var headings = ['Tag ID', 'Room ID', 'X-Coor', 'Y-Coor'];
	// Use the model to find all tags
	Rfid_ref_tag.find({userId: req.user._id}, function(err, ref_tags) {
		if (err)
			res.send(err);

		res.render('ref_tags', {
			data_ref_tags : ref_tags,
			title : 'All Reference Tags',
			heading : headings
		});
	});
};

exports.delete_ref_tag = function(req, res) {
	Rfid_ref_tag.remove({_id: req.body.rfid_tagid}, function(err) {
		if (err) {
			console.log('There is an error');
			res.send(err);
		}
		res.redirect('/rfidtags/ref_tag');
	});
};





//////////////////////////////////////////////////
// Controllers for the API app endpoints 
// 	- Controller 				-URL directed to
//---------------------------------------------------------------------------
// 	- post_ref_tag_api			- /rfidtags/ref_tags
//  - edit_ref_tag				- /rfidtags/ref_tags
// 	- delete_ref_tag 			- /rfidtags/ref_tags

// GET function for all reference tags from a certain room
// ('/api/user/:user_id/reftags/:room_id'),
exports.get_ref_tags_api = function(req, res) {
	Rfid_ref_tag.find({$and:
		[{userId: req.params.user_id},
		{roomId: req.params.room_id}]},
		function(err, ref_tags) {
		if (err)
			res.send(err);
		res.json(ref_tags);
	});
};

// GET function for specific reference tag
// ('/api/user/:user_id/reftags/:ref_tagId')
exports.get_ref_tag_api = function(req, res) {
	Rfid_ref_tag.find({$and:
		[{userId: req.params.user_id},
		 {tagId: req.params.ref_tagId}]},
		function(err, ref_tag) {
			if (err)
				res.send(err);
			res.json(ref_tag);
		});
};

// POST function for new reference tag
// ('api/user/:user_id/reftags')
exports.post_ref_tag_api = function(req, res) {
	var new_ref_tag = new Rfid_ref_tag();
	Rfid_ref_tag.count({$and:
		[{userId: req.params.user_id},
		 {tagId: req.body.tagId}]},
		function(err, count) {
			if (count > 0) {
				res.json('Reference tag already exists.');
				return;
			} else {

				new_ref_tag.userId = req.params.user_id;
				new_ref_tag.tagId = req.body.tagId;
				new_ref_tag.roomId = req.body.roomId;
				new_ref_tag.x_position = req.body.x_position;
				new_ref_tag.y_position = req.body.y_position;

				new_ref_tag.save(function(err) {
					if (err) 
						res.send(err);
						return;
				});

				res.json('New reference tag saved.');
			}
		});
};

// PUT Editing function for reference tags
// ('/api/user/:user_id/reftags/:ref_tagId')
exports.edit_ref_tag_api = function(req, res) {
	Rfid_ref_tag.update({tagId: req.params.ref_tagId},
		req.body,
		function(err, ref_tag) {
			if (err) 
				res.send(err);
			res.json({message: 'Reference tag information updated', data: ref_tag});
		});
};


// Controller to delete a specific reference tag
exports.delete_ref_tag_api = function(req,res) {
	// Use the ID to delete a specific rfid_tag
	console.log('Reference tag deleted: ' + req.body.ref_tagId);
	Rfid_ref_tag.remove({$and: 
		[{userId: req.params.user_id},
		{tagId: req.params.ref_tagId}]}, function(err) {
			if (err) {
				console.log('There is an error');
				res.send(err);
				return;
			}
			res.json({
				message: 'Reference tag deleted'
			});
	});
};

