var mongoose = require('mongoose');

var article = mongoose.Schema({

  title: String,
  content: String,
  datePosted: {type:Date, default: Date.now},
// probably don't need to specify the collection twice here and in mongoose.model
}, {collection: "articles"});

//per the mongoose docs:
//
//The first argument is the singular capital name of the collection your model is for. Mongoose automatically looks for the plural version of your model name
//
//so this should be mongoose.model("Articles", article);
module.exports = mongoose.model("articles", article);
