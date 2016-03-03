/* 
	Routes for getting/posting/deleting articles
*/

var mongoose = require('mongoose');
var path = require('path');

var Article = require('../models/articleModel.js');
var User = require('../models/userModel.js');

var routes = {};

// gets all pages sorted by title
routes.GETallPages = function(req, res){
	Article.find().sort({'title': 1}).exec(function(err, articles) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		if (!articles) {
			res.json({"error":"articles not found"});
			return;
		}
      	else {
      		res.json(articles); //send all of the articles
      		return;
      	}
    })
};

//gets single page
routes.GETpage = function(req, res){
	var id = req.params.id;

	Article.findOne({'_id' : id}, function(err,article){
		if (err) {
	      res.sendStatus(500);
	      return;
	    }

	    if (!article) {
	      res.json({"error":"article not found"});
	      return;
	    }
	    else { //get specific article and send json
      		res.json(article);
      		return;
	    }
	})
};

//posts new article to DB
routes.POSTsubmit = function(req, res){
	var b = req.body;

	var article = new Article();
	article.title = b.title;
	article.content = b.content;
	article.datePosted = new Date();

	article.save(function(err) {
	    if (err) {
	     	res.sendStatus(500);
	      	return;
	    }
	    else {
	    	res.json(article);
	    	return;
	    }
	})
};

//posts edited article to DB (IN THE WORKS)
routes.POSTedit = function(req, res){
	var b = req.body;
	var id = req.params.id;

	Article.findOne({'_id' : id}, function(err,article){
		if (err) {
	      res.sendStatus(500);
	      return;
	    }

	    if (!article) {
	      res.json({"error":"article not found"});
	      return;
	    }
	    else {
	      //For all of the keys given, check if they are empty, if not change the ingredient to have that info, and save
	      for(var key in req.body) {
	        if(req.body.hasOwnProperty(key)){
	          if (b[key] != ""){
	            article[key] = b[key]
	          }
	        }
	      }
	      //save edited todo
	      article.save(function(err) {
	        if (err) {
	          res.sendStatus(500);
	          return;
	        }
	        res.sendStatus(200);
	        return;
	      })
	    }
	})
};

// delete page from DB
routes.DELETEpage = function(req, res){
	var id = req.params.id;

  	Article.remove({ '_id' : id  }, function(err, article) {
    	if (err) {
      		res.sendStatus(500);
      		return;
    	}
    	res.json(article);
  	});
};


module.exports = routes;