// Load all necessary packages
var express = require('express');
var router = express.Router();


// Create endpoint /api/users for GET
// GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
