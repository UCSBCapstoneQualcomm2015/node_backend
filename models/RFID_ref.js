// Required packages 
var mongoose = require('mongoose');

// Define RFID reference schema
var Rfid_ref_schema = new mongoose.Schema({
	userId: String,
	tagId: String,
	roomId: String,
	x_position: String,
	y_position: String
});

// Export the schema 
module.exports = mongoose.model('RFID_ref', Rfid_ref_schema);