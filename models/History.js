// Load the packages we need
var mongoose = require('mongoose');

// Create the schema for RFID's (can be modified)
var HistorySchema = new mongoose.Schema({
	userId: String,
	tagId: String,
	xCoord: String,
	yCoord: String,
	roomId: String,
	created_at: Date
});

// Export the Mongoose model
module.exports = mongoose.model('ItemHistory', HistorySchema);