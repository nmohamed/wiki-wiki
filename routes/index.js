var mongoose = require('mongoose');
var path = require('path');

var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');

var routes = {};

routes.home = function(req, res){
	res.end();
};

module.exports = routes;