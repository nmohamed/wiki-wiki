/*
	Routes related to logging in and user management
*/

var mongoose = require('mongoose');
var path = require('path');

var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');

var routes = {};

// logs you in and adds user if you never logged in before
routes.GETlogin = function(req, res){
        // try catch is generally just used for sync code, for async handle errs returned from functions,
        // if you want to have a similar syntax as try catch for your async code look into promises,
        // they are pretty cool
	try {
            // could probably use req.user to be clearer and more consise
	    var username = req.session.passport.user.displayName;

		User.findOne({username : username}, function (err, user) {
	        if (!user) {

	        	var user = new User();
	        	user.username = username

	            user.save(function(err){
	            	res.json({username:username});
					return;
	            });
	        }else{
	        	console.log("now we're here")
            	res.json({username:username});
				return;
	        }
	    });
	}
	catch(err) {
		console.log(err)
	}
};

// gets all users
routes.GETallusers = function(req,res) {
	User.find({}, function(err,users){
		if (err) {
	      res.sendStatus(500);
	      return;
	    }

	    if (!users) { //if no user is found
	      res.json({"error":"user not found"});
	      return;
	    }
	    else { //send all users
      		res.json(users);
      		return;
	    }
	})
}

// what is this here for?
routes.POSTlogin = function(req, res){
};

module.exports = routes;
