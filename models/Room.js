// Load the packages we need
var mongoose = require('mongoose');

// Create the schema for RFID's (can be modified)
var RoomSchema = new mongoose.Schema({
	userId: String,
	length: String,
	width: String,
	name: String
});

// Export the Mongoose model
module.exports = mongoose.model('Room', RoomSchema);