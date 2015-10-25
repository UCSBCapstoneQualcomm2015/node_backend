// Get the packages we need
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var Rfid = require('./models/rfid_tags'); 
var routes = require('./routes/index');
var users = require('./routes/users');
var rfidController = require('./routes/rfid_tags');




// Connect to the RFID MongoDB
mongoose.connect('mongodb://localhost:27017/rfid_tags_db');

// Create our Express application
var app = express();

// Create our Express router
var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Initialize all packages to be used in application
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Create endpoint for /
app.use('/', routes);

// Create endpoint for /users
app.use('/users', users);

// Create endpoint handlers for /rfid_tags
router.route('/rfid_tags')
  .post(rfidController.postRfid_tags);

// Register all routes with /api
app.use('/api', router);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
