var path = require('path');

var Todo = require('../models/appModel.js').TodoModel;

var mongoose = require('mongoose');
var db = mongoose.connection;

var routes = {};

//TO GET ALL ACTIVE TODOS
routes.getactivetodos = function(req, res) {
	//Only find the todos that are not completed and sort them
	Todo.find({'completed':false}).sort({'date_posted': 'desc'}).exec(function(err, todos) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		if (!todos) {
			res.json({"error":"twotes not found"});
			return;
		}
      	else {
      		res.json(todos); //send all of the todos
      		return;
      	}
    })
}

//get all completed todos
routes.getcompletedtodos = function(req, res) {
	//find all todos that have true completed
	Todo.find({'completed':true}).sort({'date_posted': 'desc'}).exec(function(err, todos) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		if (!todos) {
			res.json({"error":"twotes not found"});
			return;
		}
      	else {
      		res.json(todos);
      		return;
      	}
    })
}

//get all todos
routes.getalltodos = function(req, res) {
	//get all todos (completed and active) and sort by date posted
	Todo.find({}).sort({'date_posted': 'desc'}).exec(function(err, todos) {
		if (err) {
			res.sendStatus(500);
			return;
		}

		if (!todos) {
			res.json({"error":"twotes not found"});
			return;
		}
      	else {
      		res.json(todos);
      		return;
      	}
    })
}

//post a todo
routes.posttodo = function(req, res) {
  var b = req.body;

  //Create the new model
  var todo = new Todo();
  todo.todoitem = b.todoitem;
  todo.date_posted = new Date();
  todo.completed = false;

  //save todo
  todo.save(function(err) {
    if (err) {
     	res.sendStatus(500);
      	return;
    }
    else {
		Todo.find({'completed':false}).sort({'date_posted': 'desc'}).exec(function(err, todos) {
			if (err) {
				res.sendStatus(500);
				return;
			}

			if (!todos) {
				res.json({"error":"twotes not found"});
				return;
			}
	      	else {
	      		//get all todos and send
	      		res.json(todos);
	      		return;
	      	}
	    })
    }
  })
};

//edit route 
routes.edittodo = function(req,res) {
	var b = req.body;
	var id_todo = req.params.id_todo;
	Todo.findOne({'_id' : id_todo}, function(err,todo){
		if (err) {
	      res.sendStatus(500);
	      return;
	    }

	    if (!todo) {
	      res.json({"error":"todo not found"});
	      return;
	    }
	    else {
	      //For all of the keys given, check if they are empty, if not change the ingredient to have that info, and save
	      for(var key in req.body) {
	        if(req.body.hasOwnProperty(key)){
	          if (b[key] != ""){
	            todo[key] = b[key]
	          }
	        }
	      }
	      //save edited todo
	      todo.save(function(err) {
	        if (err) {
	          res.sendStatus(500);
	          return;
	        }
	        res.sendStatus(200);
	        return;
	      })
	    }
	})
}

//this is to "delete" from current html, but just change completed to true
routes.deletetodo = function(req,res) {
	var id_todo = req.params.id_todo;
	Todo.findOne({'_id' : id_todo}, function(err,todo){
		if (err) {
	      res.sendStatus(500);
	      return;
	    }

	    if (!todo) {
	      res.json({"error":"todo not found"});
	      return;
	    }
	    else {
	      //For all of the keys given, check if they are empty, if not change the ingredient to have that info, and save
	      todo.completed = true;
	      todo.save(function(err) {
	        if (err) {
	          res.sendStatus(500);
	          return;
	        }
			Todo.find({'completed':false}).sort({'date_posted': 'desc'}).exec(function(err, todos) {
				if (err) {
					res.sendStatus(500);
					return;
				}

				if (!todos) {
					res.json({"error":"twotes not found"});
					return;
				}
		      	else {
		      		res.json(todos); //send all not completed todos
		      		return;
		      	}
		    })
	      })
	    }
	})
}

module.exports = routes;