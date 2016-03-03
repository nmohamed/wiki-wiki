/* 
  Application. Run this using node!
*/

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var exphbs  = require('express-handlebars');

var index = require('./routes/index');
var login = require('./routes/login');
var pages = require('./routes/pages');

var app = express();

var password = require("./password")(passport);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'this is not a secret ;)',
  cookie:{},
  resave: false,
  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// app.get('/', index.home)
app.get("/login", login.GETlogin);
app.post("/createuser", login.POSTlogin);
app.get("/getusers", login.GETallusers);

app.get('/allpages', pages.GETallPages);
app.get('/page/:id', pages.GETpage);
app.post('/submitpage', pages.POSTsubmit);
app.post('/editpage/:id', pages.POSTedit);
app.delete('/deletepage/:id', pages.DELETEpage);


//GET Requests for Facebook LogIn
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/' })
);

// Logout of Facebook
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

mongoose.connect('mongodb://wiki:olinjs@ds017678.mlab.com:17678/wiki', function(err){
	if(err) console.log(err);
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Application running on port:', PORT);
});

module.exports = app;

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
    res.redirect("/login");
}