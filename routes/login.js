var mongoose = require('mongoose');
var path = require('path');

var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');

var routes = {};

routes.GETlogin = function(req, res){
	var id = req.params.id;

	User.findOne({'_id' : id}, function(err,user){
		if (err) {
	      res.sendStatus(500);
	      return;
	    }

	    if (!user) {
	      res.json({"error":"user not found"});
	      return;
	    }
	    else {
	    	//get specific user and send json
      		res.json(user);
      		return;
	    }
	})
};


routes.POSTlogin = function(req, res){
	res.json({message:'Login successful'});
};

module.exports = routes;