// Load the packages we need
var mongoose = require('mongoose');

// Create the schema for RFID's (can be modified)
var RfidSchema = new mongoose.Schema({
	userId: String,
	tagId: String,
	readerId: String,
	location: String,
	reference: Boolean
});

// Export the Mongoose model
module.exports = mongoose.model('RFID', RfidSchema);