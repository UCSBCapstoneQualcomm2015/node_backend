// Load the packages we need
var mongoose = require('mongoose');

// Create the schema for RFID's (can be modified)
var SnapDragonSchema = new mongoose.Schema({
	name: String,
	userId: String,
	ipAddress: String,
	roomId: String,
	xCoord: String, 
	yCoord: String
});

// Export the Mongoose model
module.exports = mongoose.model('SnapDragon', SnapDragonSchema);