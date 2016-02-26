var mongoose = require('mongoose');

var user = mongoose.Schema({

  username: String,

}, {collection: "users"});

module.exports = mongoose.model("users", user);