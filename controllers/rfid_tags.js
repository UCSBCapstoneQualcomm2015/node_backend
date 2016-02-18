// Load the required packages 
var Rfid = require('../models/RFID');
var request = require("request");
var http = require('http');


// Controllers for the web app endpoints 
// 	- Controller 				-Jade Files 				-URL directed to
//---------------------------------------------------------------------------
//	- getRfid_Tag_form 			-rfid_tags/new_tag_form		- /rfidtags/new_tag_form
// 	- getEdit_rfid_tag_form		-rfid_tags/edit_tag_form 	- /rfidtags/edit_tag_form_in
// 	- getRfid_tags 				-rfid_tags 					- /rfidtags
// 	- postRfid_tags				-							- /rfidtags
//  - putRfid_tag				-							- /rfidtags
// 	- deleteRfid_tag 			-							- /rfidtags

// Controller to render form for new tag (web app)
exports.getRfid_Tag_form = function(req, res) {
	res.render('rfid_tags/new_tag_form');
};

// Controller to render the edit tag form (web app)
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

// Controller to show all the tags on the page (web app)
exports.getRfid_tags = function(req, res) {

	var headings = ['Tag ID', 'Reference', 'Location', 'Reader ID'];
	// Use the rfid_tags model to find all the rfid_tags
	Rfid.find({userId: req.user._id},function (err, rfid_tags) {
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

// Controller to add new tag to database (web app)
exports.postRfid_tags = function(req, res) {

	// Create new instance of the RFID_tag model
	var rfid_tags = new Rfid();
	var headings = ['Tag ID', 'Name', 'Location Last Seen'];

	// Set the rfid_tags properties from POST data
	rfid_tags.tagId = req.body.tagId;
	rfid_tags.name = req.body.name;
	rfid_tags.userId = req.user._id;

	// Save the RFID tag info and check for errors
	rfid_tags.save(function(err) {
		if (err)
			res.send(err);
	});

	res.redirect('/rfidtags');
};





// Controller to edit the information of a tag with the editing form (web app)
exports.putRfid_tag = function(req, res) {
	// Use the rfid_tags model to modify rfid_tag
	Rfid.findById(req.body.rfid_tag_id, function(err, rfid_tag) {

		if (err)
			res.send(err);

		// Update the existing location (can modify to add anything)
		rfid_tag.tagId = req.body.tagId;
		rfid_tag.name = req.body.name;
		//rfid_tag.reference = req.body.reference;
		//rfid_tag.readerId = req.body.readerId;

		// Save the rfid_tag and check for errors
		rfid_tag.save(function(err) {
			if (err)
				res.send(err);
			res.redirect('/rfidtags');
		});
	});
};

// Controller to delete a tag (web app)
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



// Controllers for the API endpoints
// -Controller 			-Resource URL
//---------------------------------------------------------------
// - get_RFID_tags		- /api/rfidtags
// - get_RFID_tag 		- /api/rfidtags
// - post_RFID_tag		- /api/rfidtags
// - put_RFID_tag 		- /api/rfidtags
// - delete_RFID_tag 	- /api/rfidtags

// Controller to GET all RFID tags ('/api/user/:user_id/rfidtags/'),
exports.get_RFID_tags = function(req, res) {
	// Find all the tags associated with current user
	Rfid.find({ userId: req.params.user_id}, function(err,rfid_tags) {
		if (err)
			res.send(err);
		res.json(rfid_tags);
	});
};

// Controller to GET specific id ('/api/user/:user_id/rfidtags/:rfid_tagId')
exports.get_RFID_tag = function(req, res) {
	// Find tags that match the user id and tag id
	Rfid.find({$and: 
		[{userId: req.params.user_id},
		 {tagId: req.params.rfid_tagId}]}, 
		function (err, rfid_tag) {
		if (err)
			res.send(err);
		res.json(rfid_tag);
	});
};


// Controller to POST new RFID tag ('/api/user/:user_id/rfidtags')
exports.post_RFID_tag = function(req, res) {
	var rfid_tags = new Rfid();
	// Set the rfid_tags properties from POST data
	Rfid.count({$and:
		[{userId: req.params.user_id},
		{tagId: req.body.tagId}]},
		function (err, count){ 
	    if(count>0){
	    	res.json({message: 'Tag already exists'}); 
	    	return;
	    } else{
	    	rfid_tags.tagId = req.body.tagId;
	    	rfid_tags.name = req.body.name; 
	    	rfid_tags.userId = req.params.user_id;

			rfid_tags.save(function(err) {
		    	if (err){
		    		res.send(err);
		    		return;
		    	}
	    	});
			res.json({message: 'New Tag Added', data: rfid_tags});
			/*--------------------------------------------------------*/
			/*
			var successString = "Success", failureString = "Failure";
			var dedicatedSnapRegister = '192.168.2.9';

			callback = function(response) {
			  	var str = ''
			  	response.on('data', function (chunk) { str += chunk; });
			  	response.on('end', function () {
					console.log(str);
					if (str.indexOf(successString)) {
				
				    	res.json({message: 'New Tag Added', data: rfid_tags});   	
					} else {
						res.json({message: 'Failed to program rfid with sensor.'})
					}
		    	});
			}
			console.log(rfid_tags._id);
			console.log(req.body._id);
			//Create header options for connecting to snapdragon python servers
			var options = { host: dedicatedSnapRegister, path: '/writeRfid', port: '8000',
				headers: { 'tagId' : rfid_tags._id} };

			var r = http.request(options, callback);
			r.on('error', function(err) {
			    // Handle error
			});
			r.on('socket', function (socket) {
			    socket.setTimeout(3000);  
			    socket.on('timeout', function() {
			    	console.log("time out")
			        r.abort();
			    });
			});
			r.end();*/
			/*--------------------------------------------------------*/

		}
	});
};


// Controller to PUT a specific RFID tag ('/api/user/:user_id/rfidtags/:rfid_tagId')
exports.put_RFID_tag = function(req, res) {

var i = -1;

	Rfid.count({$and:
		[{userId: req.params.user_id},
		{tagId: req.params.rfid_tagId}]},
		function (err, count){
	    if(count==0){
	    	res.json({message: 'Tag does not exist'});
	    	return; 
		}else{
			Rfid.count({$and:
				[{userId: req.params.user_id},
				{tagId: req.body.tagId}]},
				function (err, count){ 
			    if(count>0 && (req.body.tagId != req.params.rfid_tagId)){
			    	res.json({message: 'Tag already exists'}); 
			    	return;
			    }else{
					Rfid.update({$and:
						[{userId: req.params.user_id},
						{tagId: req.params.rfid_tagId}]}, 
						req.body,
						function(err, rfid_tag) {
							if (err)
							res.send(err);
						res.json({message: 'RFID tag information updated', data: rfid_tag});
						return;
						}
					);
				}
		});
}});
}



// Controller to delete a specific tag
exports.delete_RFID_tag = function(req,res) {
	// Use the ID to delete a specific rfid_tag
	console.log('Tag Deleted: ' + req.body.rfid_tag_id);
	Rfid.remove({$and: 
		[{userId: req.params.user_id},
		{tagId: req.params.rfid_tagId}]}, function(err) {
			if (err) {
				console.log('There is an error');
				res.send(err);
				return;
			}
			res.json({
				message: 'Tag Deleted'
			});
	});
};







