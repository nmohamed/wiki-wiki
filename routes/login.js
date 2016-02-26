// var Items = require('../models/itemModel.js');
var mongoose = require('mongoose');
var path = require('path');

var loginGET = function(req, res){
	res.end();
};

module.exports.loginGET = loginGET;

var loginPOST = function(req, res){
	res.json({message:'Login successful'});
	//res.json({message:'Login unsuccessful'});
};

module.exports.loginPOST = loginPOST;