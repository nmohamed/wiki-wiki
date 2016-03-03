var mongoose = require('mongoose');
var path = require('path');

var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');

var routes = {};

routes.GETlogin = function(req, res){
	// var id = req.params.id;

	var username = req.session.passport.user.displayName;

	User.findOne({username : username}, function (err, docs) {
        if (err) {
            res.json({username:username});
			return;
        }else{
        	var user = new User();
        	user.username = username

            user.save(function(err){
            	res.json({username:username});
				return;
            });
        }
    });
};

routes.GETallusers = function(req,res) {
	User.find({}, function(err,users){
		if (err) {
	      res.sendStatus(500);
	      return;
	    }

	    if (!users) {
	      res.json({"error":"user not found"});
	      return;
	    }
	    else {
	    	//get specific user and send json
      		res.json(users);
      		return;
	    }
	})
}

routes.POSTlogin = function(req, res){

};

module.exports = routes;