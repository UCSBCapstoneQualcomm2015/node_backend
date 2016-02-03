// Load the packages we need
var mongoose = require('mongoose');

// Create the schema for RFID's (can be modified)
var ReferenceTag = new mongoose.Schema({
	userId: String,
	tagId: String,
	roomId: String,
	coordinates: String
});

// Export the Mongoose model
module.exports = mongoose.model('ReferenceTag', RfidSchema);