// Load the required packages
var Rfid_ref_tag = require('../models/RFID_ref');
var Rfid_ref_tag_room = require('../models/Room');
var request = require("request");
var http = require('http');
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
// ('/api/user/:user_id/reftags/rooms/:room_id'),
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
				res.json({message: 'Reference tag ID already exists.'});
				return;
			}
			else{
		
				//check = 0;
				Rfid_ref_tag_room.count({$and:
					[{_id: req.body.roomId},
					{userId: req.params.user_id}]},
					function(err, count) {
					if (count == 0) {
						res.json({message: 'Room corresponding to the tag does not exist, please add the room and its dimensions first'});
						return;
					}
					else {
						new_ref_tag.userId = req.params.user_id;
						new_ref_tag.name = req.body.name;
						new_ref_tag.tagId = req.body.tagId;
						new_ref_tag.roomId = req.body.roomId;
						new_ref_tag.xCoord = req.body.xCoord;
						new_ref_tag.yCoord = req.body.yCoord;

						var room = Rfid_ref_tag_room.findOne({'_id': new_ref_tag.roomId});
		    			room.select('length width');
		    			room.exec(function (err, r) {
  							if (err) return handleError(err);
		   					if(parseInt(new_ref_tag.xCoord) < 0 || parseInt(new_ref_tag.yCoord) < 0 || parseInt(new_ref_tag.xCoord) > parseInt(r.width) || parseInt(new_ref_tag.yCoord) > parseInt(r.length)){
		    					res.json({message: 'Enter valid coordinates in room'}); 
	    						return;
		    				}else{
								new_ref_tag.save(function(err) {
								if (err) 
									res.send(err);
								return;
								});
								res.json({message: 'New reference tag saved.'});
								return;
							}
						});
					}
				}
				);
			}
		});
};




// PUT Editing function for reference tags
// ('/api/user/:user_id/reftags/:ref_tagId')
exports.edit_ref_tag_api = function(req, res) {
	var i = -1;

	Rfid_ref_tag.count({$and:
		[{userId: req.params.user_id},
		{tagId: req.params.ref_tagId}]},
		function (err, count){
	    if(count==0){
	    	console.log('check0');
	    	res.json({message: 'Tag does not exist'});
	    	return; 
		}else{
			Rfid_ref_tag.count({$and:
				[{userId: req.params.user_id},
				 {tagId: req.body.tagId}]},
				function(err, count) {
					console.log('count = ', count);
					if (count > 0 && req.body.tagId != req.params.ref_tagId) {
						res.json({message: 'Reference tag ID already exists.'});
						return;
					}
					else{
						var room = Rfid_ref_tag_room.findOne({'_id': req.body.roomId});
		    			room.select('length width');
		    			room.exec(function (err, r) {
  							if (err) return handleError(err);
		   					if(parseInt(req.body.xCoord) < 0 || parseInt(req.body.yCoord) < 0 || parseInt(req.body.xCoord) > parseInt(r.width) || parseInt(req.body.yCoord) > parseInt(r.length)){
		    					res.json({message: 'Enter valid coordinates in room'}); 
	    						return;
		    				}else{
								Rfid_ref_tag.update({tagId: req.params.ref_tagId}, 
									req.body,
									function(err, ref_tag) {
										if (err)
										res.send(err);
									res.json({message: 'Reference tag information updated', data: ref_tag});
									return;
									}

								);
							}
						}
						);
					}
				})};
		}
		);};


	/*Rfid_ref_tag.update({tagId: req.params.ref_tagId},
		req.body,
		function(err, ref_tag) {
			if (err) 
				res.send(err);
			res.json({message: 'Reference tag information updated', data: ref_tag});
		});
};*/


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

