// Load the packages we need
var mongoose = require('mongoose');

// Create the schema for RFID's (can be modified)
var RfidSchema = new mongoose.Schema({
	userId: String,
	tagId: String,
	name: String,
	lastSeen: { type: String, default: "Item not seen yet" },
	allSeen: [String]
});

// Export the Mongoose model
module.exports = mongoose.model('RFID', RfidSchema);