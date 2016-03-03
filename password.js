/* 
  Facebook login authorization management
*/

// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;


// load the auth variables
var auth = require('./auth'); // use this one for testing

module.exports = function(passport) {


    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });


    //FACEBOOK
    passport.use(new FacebookStrategy({
        clientID: auth.FACEBOOK_APP_ID,
        clientSecret: auth.FACEBOOK_APP_SECRET,
        callbackURL: auth.FACEBOOK_CALLBACK_URL
      },
      function(accessToken, refreshToken, profile, done) {
        //This is not what you want to do here. 
        //Here you should search the connected DB if the user exists and load that in, or add it to db.
        done(null, profile);
      }
    ));
};