var mongoose = require('mongoose');

// Create a Schema
var itemSchema = mongoose.Schema({
  item: String
});

module.exports = mongoose.model("Items", itemScheme);