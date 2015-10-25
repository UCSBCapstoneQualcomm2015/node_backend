// Load necessary packages
var express = require('express');
var router = express.Router();

/* GET home page. */
// Create endpoint /api/ for GET
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express 1' });
});


module.exports = router;
