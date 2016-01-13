// Required packages 
var mongoose = require('mongoose');

// Define RFID reference schema
var Rfid_ref_schema = new mongoose.Schema({
	userId: String,
	tagId: String,
	roomId: String,
	xCoord: String,
	yCoord: String
});

// Export the schema 
module.exports = mongoose.model('RFID_ref', Rfid_ref_schema);