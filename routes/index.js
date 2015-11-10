var express = require('express');
var router = express.Router();
// Load the required packages 
var Rfid = require('../models/rfid_tags');


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	console.log("hello");
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
	console.log("hello2");
}



module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		// Use the rfid_tags model to find all the rfid_tags for a user
		var headings = ['Tag ID', 'Reference', 'Location', 'Reader ID'];
		// Use the rfid_tags model to find all the rfid_tags
		Rfid.find({ userId: req.user._id }, function (err, rfid_tags) {
			if (err)
				res.send(err);

			//res.json(rfid_tags);
			res.render('rfid_tags', {
				data_rfidTags : rfid_tags,
				title : 'All User Tags',
				heading : headings
			});
		});
	});


	router.post('/home', function(req,res){
		// Create new instance of the RFID_tag model
		var rfid_tags = new Rfid();

		// Set the rfid_tags properties from POST data
		rfid_tags.tagId = req.body.tagId;
		rfid_tags.readerId = req.body.readerId;
		rfid_tags.location = req.body.location;
		rfid_tags.reference = req.body.reference;
		//rfid_tags.userId = req.user._id;
		rfid_tags.userId = req.body.userId;

		// Save the RFID tag info and check for errors
		rfid_tags.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'RFID tag added to the database ', data: rfid_tags });
		});
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}
