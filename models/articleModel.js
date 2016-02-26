var mongoose = require('mongoose');

var article = mongoose.Schema({

  title: String,
  content: String,
  datePosted: {type:Date, default: Date.now},

}, {collection: "articles"});

module.exports = mongoose.model("articles", article);