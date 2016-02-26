var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/todoDB');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'superS3CRE7',
  resave: false,
  saveUninitialized: false ,
  cookie: {}
}));

app.get('/', index.home);
// app.post('/add', index.add);
// app.post('/remove', index.remove);

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Application running on port:', PORT);
});

module.exports = app;