var mongoose = require('mongoose');

var userEvent = new mongoose.Schema({
  userId: String,
  distances: [String]
});

module.exports = mongoose.model('UserEvent', userEvent);