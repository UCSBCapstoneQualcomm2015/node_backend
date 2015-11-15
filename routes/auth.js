// Load required packages
var passport = require('passport');
var LocalStrategy = require('passport-local-forms').Strategy;
var User = require('../models/users');
var forms = require('forms');
var fields = forms.fields;

// Creating form
var loginForm = forms.create (
{
  username: fields.string({ required: true}),
  password: fields.string({ required: true})
});


passport.use(new LocalStrategy(
  {
    form: loginForm,
    formError: function(err,req,form) {
      req.res.render('home.ejs', {loginForm: form, user: req.user, message: err.message });
    }
  },
  function(form, done) {
    User.findOne({ username: form.data.username}, 
        function(err,user) {
          if (err) {return done(err);}
          if (!user) {return done(null, false); }
          if (!user.verifyPassword(form.data.password, 
            function(err, isMatch) {
              if (err) 
                { return done(err); }

              // Password did not match
              if (!isMatch)
                { return done(null, false); }

              // Success
              return done(null, user);
            }
            )
          ) {}
        } 
      );
  }
));

  /*
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
  */
//));

exports.isAuthenticated = passport.authenticate('local-forms', { session : false });