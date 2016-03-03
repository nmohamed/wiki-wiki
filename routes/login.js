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
	try {
	    var username = req.session.passport.user.displayName;

		User.findOne({username : username}, function (err, user) {
	        if (err) {
	        	var user = new User();
	        	user.username = username

	            user.save(function(err){
	            	res.json({username:username});
					return;
	            });
	        }else{
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

routes.POSTlogin = function(req, res){
};

module.exports = routes;