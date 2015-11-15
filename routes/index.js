// Load necessary packages
var express = require('express');
//var router = express.Router();

/* GET home page. */
// Create endpoint /api/ for GET
/*
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express 1' });
});
*/

// Get the home page
exports.getHomepage = function(req,res) {
	res.render('index', {title: 'Sniffit'});
};

//module.exports = router;

