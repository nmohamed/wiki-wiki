var mongoose = require('mongoose');
var path = require('path');

var home = function(req, res){
	res.end();
};

module.exports.home = home;