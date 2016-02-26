var mongoose = require('mongoose');
var path = require('path');

var GETlogin = function(req, res){
	res.end();
};

module.exports.GETlogin = GETlogin;

var POSTlogin = function(req, res){
	res.json({message:'Login successful'});
	//res.json({message:'Login unsuccessful'});
};

module.exports.POSTlogin = POSTlogin;