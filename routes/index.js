// var Items = require('../models/itemModel.js');
var mongoose = require('mongoose');
var path = require('path');

/* HOME */

var home = function(req, res){
	res.sendFile('index.html', { root: path.join(__dirname, '../public') });
};

module.exports.home = home;

// /* ADD */

// var add = function(req, res){
// 	res.render('remove', {message: 'removed'});
// };

// module.exports.add = add;

// /* REMOVE */

// var remove = function(req, res){
// 	res.render('remove', {message: 'removed'});
// };

// module.exports.remove = remove;