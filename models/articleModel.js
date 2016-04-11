var mongoose = require('mongoose');

var article = mongoose.Schema({

  title: String,
  content: String,
  datePosted: {type:Date, default: Date.now},

}, {collection: "articles"});


// Mongoose is weird and always looks for the capital plural. This should techincally be mongoose.model("Articles", article).
module.exports = mongoose.model("articles", article);