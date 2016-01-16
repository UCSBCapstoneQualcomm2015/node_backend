// Load the required packages 
var SnapDragon = require('../models/SnapDragon');
var Room = require('../models/Room');


// Controllers for the web app endpoints 
// 	- Controller 				-Jade Files 							-URL directed to
//-------------------------------------------------------------------------------------------------------------
//	- get_snapdragon_form 		-snapdragons/new_snapdragon_form		- /snapdragons/new_snapdragon_form
// 	- get_edit_snapdragon_form	-snapdragons/edit_snapdragon_form 		- /snapdragons/edit_snapdragon_form_in
// 	- get_snapdragons 			-snapdragons 							- /snapdragons
// 	- post_snapdragon			-										- /snapdragons
//  - edit_snapdragon			-										- /snapdragons
// 	- delete_snapdragon 		-										- /snapdragons

// Controller to GET the form for a new Snapdragon 
exports.get_snapdragon_form = function(req, res) {
	res.render('snapdragons/new_snapdragon_form');
};

// Controller to GET the editing form for a Snapdragon
exports.get_edit_snapdragon_form = function(req, res) {
	SnapDragon.findById(req.body.snapdragon_id, function (err, snapdragon) {
		if (err)
			res.send(err);
		res.render('snapdragons/edit_snapdragon_form',{
			snapdragon_data: snapdragon
		});
	});	
};

// Controller to GET all the registered Snapdragons 
exports.get_snapdragons = function(req, res) {
	var headings = ['Room', 'IP Address'];
	// Use the Snapdragon model to find all the rfid_tags
	SnapDragon.find({userId: req.user._id},function (err, snapdragons) {
		if (err)
			res.send(err);

		res.render('snapdragons', {
			snapdragon_data : snapdragons,
			title : 'Snap Dragon Data',
			heading : headings
		});
	});
};

// Controller to POST a new Snapdragon module
exports.post_snapdragon = function(req, res) {

	// Create new instance of the Snapdragon model
	var snapdragons = new SnapDragon();
	var headings = ['Room Id', 'IP Address'];

	// Set the Snapdragon properties from POST data
	snapdragons.roomId = req.body.roomId;
	snapdragons.ipAddress = req.body.ipAddress;
	snapdragons.userId = req.user._id;


	// Save the Snapdragon info and check for errors
	snapdragons.save(function(err) {
		if (err)
			res.send(err);
	});

	res.redirect('/snapdragons');
};

// Controller to PUT (edit) the data of a specific Snapdragon module
exports.edit_snapdragon = function(req, res) {
	// Use the Snapdragon model to modify data
	SnapDragon.findById(req.body.snapdragon_id, function(err, snapdragon) {
		if (err)
			res.send(err);

		// Update the existing data (can modify to add anything)
		snapdragon.roomId = req.body.name;
		snapdragon.ipAddress = req.body.height;

		// Save the new data and check for errors
		room.save(function(err) {
			if (err)
				res.send(err);
			res.redirect('/snapdragons');
		});
	});
};

// Controller to DELETE a Snapdragon module from database
exports.delete_snapdragon = function(req,res) {
	// Use the ID to delete a specific Snapdragon
	SnapDragon.remove({ _id: req.body.snapdragon_id}, function(err) {
		
		if (err) {
			console.log('There is an error');
			res.send(err);
		}
		res.redirect('/snapdragons');
	});
};


// Controllers for the API endpoints 
// 	- Controller 					- Resource URL
//-------------------------------------------------------------
// 	- get_snapdragons_api 			- /snapdragons
//  - get_snapdragon_api 			- /snapdragons
// 	- post_snapdragon_api			- /snapdragons
//  - edit_snapdragon_api			- /snapdragons
// 	- delete_snapdragon_api 		- /snapdragons


// Controller to GET all the registered Snapdragons for a certain room
exports.get_snapdragons_api = function(req, res) {
	var headings = ['Room', 'IP Address'];
	// Use the Snapdragon model to find all the rfid_tags
	SnapDragon.find({$and:
		[{userId: req.params.user_id},
		{roomId: req.params.room_id}]},
		function (err, snapdragons) {
		if (err)
			res.send(err);
		res.json(snapdragons);
	});
};

// Controller to GET a specific Snapdragon data
exports.get_snapdragon_api = function(req, res) {
	SnapDragon.find({$and: 
		[{userId: req.params.user_id},
		{ipAddress: req.params.snapdragon_ip}]}, 
		function(err, snapdragon) {
		if (err)
			res.send(err);
		res.json(snapdragon);
	});
};

// Controller to POST a new Snapdragon module
exports.post_snapdragon_api = function(req, res) {
	// Create new instance of the Snapdragon model
	var snapdragons = new SnapDragon();

	SnapDragon.count({$and:
		[{userId: req.params.user_id},
		{ipAddress: req.params.snapdragon_ip}]},
		function (err, count){ 
	    if(count>0){
	    	res.json({message: 'SnapDragon already exists'}); 
	    	return;
	    }else{
	    	// Set the Snapdragon properties from POST data
	    	snapdragons.name = req.body.name;
	    	snapdragons.roomId = req.body.roomId;
	    	snapdragons.ipAddress = req.body.ipAddress;
	    	snapdragons.xCoord = req.body.xCoord;
	    	snapdragons.yCoord = req.body.yCoord;
	    	snapdragons.userId = req.params.user_id;
	    	snapdragons.save(function(err) {
		    	if (err){
		    		res.send(err);
		    		return;
		    	}
	    	});
	    	res.json({message: 'New Snapdragon registered!', data: snapdragons});	
		}
	});
}	


// Controller to PUT (edit) the data of a specific Snapdragon module
exports.edit_snapdragon_api = function(req, res) {
	SnapDragon.count({$and:
		[{userId: req.params.user_id},
		{ipAddress: req.params.ipAddress}]}, function (err, count){ 
	    if(count>0){
	    	res.json({message: 'SnapDragon already exists'}); 
	    	return;
	    }else{
			SnapDragon.update({$and: 
			[{userId: req.params.user_id},
			{ipAddress: req.params.snapdragon_ip}]}, 
			req.body,
			function(err, snapdragon) {
				if (err){
					res.send(err);
					return;
				}
				res.json({message: 'Updated SnapDragon information', data: snapdragon});
			});
		}
	});	
}

// Controller to DELETE a Snapdragon module from database
exports.delete_snapdragon_api = function(req,res) {
	// Use the ID to delete a specific Snapdragon
	console.log('Tag Deleted: ' + req.params.snapdragon_ip);
	SnapDragon.remove({$and: 
		[{userId: req.params.user_id},
		{ipAddress: req.params.snapdragon_ip}]}, function(err) {
		if (err) {
			console.log('There is an error');
			res.send(err);
		}
		res.json({message: 'Deleted Snapdragon.'});
	});
}


