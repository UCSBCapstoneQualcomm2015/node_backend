// Load all necessary packages
var User = require('../models/users');
var express = require('express');
var router = express.Router();


// Create endpoint for /api/users for POST
exports.postUsers = function(req,res) {
	// Create new instance of the User model
	var user = new User({
		// Set the User information for POST data
		username: req.body.username,
		password: req.body.password
	});

	// Save the User data and check for errors
	user.save(function(err) {
		if (err)
			res.send(err);
		res.json({ message: 'New user is added to the database', data: user});
	});
};



// Create endpoint /api/users for GET
exports.getUsers = function (req, res) {
	User.find(function(err, users) {
		if (err)
			res.send(err);
		res.json(users);
	});
};

