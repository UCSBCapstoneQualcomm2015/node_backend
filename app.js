/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var jwt = require('jsonwebtoken');

var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');



/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');
var rfidController = require('./controllers/rfid_tags');
var roomController = require('./controllers/room');
var snapController = require('./controllers/snapdragon');
var refController = require('./controllers/ref_tags');

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('tokenSecret', secrets);
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'expanded'
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: false,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) req.session.returnTo = req.path;
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);


// Our Web App routes
app.post('/rfidtags/new_tag_form', passportConf.isAuthenticated, rfidController.postRfid_tags);
app.get('/rfidtags/new_tag_form',passportConf.isAuthenticated, rfidController.getRfid_Tag_form);
app.get('/rfidtags', passportConf.isAuthenticated, rfidController.getRfid_tags);
app.post('/rfidtags', passportConf.isAuthenticated, rfidController.deleteRfid_tag);
app.post('/rfidtags/edit_tag_form_in', passportConf.isAuthenticated, rfidController.getEdit_rfid_tag_form);
app.post('/rfidtags/edit_tag_form', passportConf.isAuthenticated, rfidController.putRfid_tag);

app.post('/rooms/new_room_form', passportConf.isAuthenticated, roomController.post_room);
app.get('/rooms/new_room_form',passportConf.isAuthenticated, roomController.get_room_form);
app.get('/rooms', passportConf.isAuthenticated, roomController.get_rooms);
app.post('/rooms', passportConf.isAuthenticated, roomController.delete_room);
app.post('/rooms/edit_room_form_in', passportConf.isAuthenticated, roomController.get_edit_room_form);
app.post('/rooms/edit_room_form', passportConf.isAuthenticated, roomController.edit_room);

app.post('/snapdragons/new_snapdragon_form', passportConf.isAuthenticated, snapController.post_snapdragon);
app.get('/snapdragons/new_snapdragon_form',passportConf.isAuthenticated, snapController.get_snapdragon_form);
app.get('/snapdragons', passportConf.isAuthenticated, snapController.get_snapdragons);
app.post('/snapdragons', passportConf.isAuthenticated, snapController.delete_snapdragon);
app.post('/snapdragons/edit_snapdragon_form_in', passportConf.isAuthenticated, snapController.get_edit_snapdragon_form);
app.post('/snapdragons/edit_snapdragon_form', passportConf.isAuthenticated, snapController.edit_snapdragon);


app.get('/find', passportConf.isAuthenticated, homeController.getFind);
app.post('/find', passportConf.isAuthenticated, homeController.postFind);



// Our API routes
//      User Authentification
app.post('/api/login', userController.post_login_api);
app.post('/api/signup', userController.post_signup_api);
//      RFID Tags 
app.get('/api/user/:user_id/rfidtags/', passportConf.is_authenticated_api, rfidController.get_RFID_tags);
app.get('/api/user/:user_id/rfidtags/:rfid_tagId', passportConf.is_authenticated_api, rfidController.get_RFID_tag);
app.post('/api/user/:user_id/rfidtags', passportConf.is_authenticated_api, rfidController.post_RFID_tag);
app.put('/api/user/:user_id/rfidtags/:rfid_tagId', passportConf.is_authenticated_api, rfidController.put_RFID_tag);
app.delete('/api/user/:user_id/rfidtags/:rfid_tagId', passportConf.is_authenticated_api, rfidController.delete_RFID_tag);
//      Reference Tags
app.get('/api/user/:user_id/reftags/rooms/:room_id', passportConf.is_authenticated_api, refController.get_ref_tags_api);
app.get('/api/user/:user_id/reftags/:ref_tagId', passportConf.is_authenticated_api, refController.get_ref_tag_api);
app.post('/api/user/:user_id/reftags/', passportConf.is_authenticated_api, refController.post_ref_tag_api);
app.put('/api/user/:user_id/reftags/:ref_tagId', passportConf.is_authenticated_api, refController.edit_ref_tag_api);
app.delete('/api/user/:user_id/reftags/:ref_tagId', passportConf.is_authenticated_api, refController.delete_ref_tag_api);
//      Rooms
app.get('/api/user/:user_id/rooms', passportConf.is_authenticated_api, roomController.get_rooms_api);
app.get('/api/user/:user_id/rooms/:room_id', passportConf.is_authenticated_api, roomController.get_room_api);
app.post('/api/user/:user_id/rooms', passportConf.is_authenticated_api, roomController.post_room_api);
app.put('/api/user/:user_id/rooms/:room_id', passportConf.is_authenticated_api, roomController.edit_room_api);
app.delete('/api/user/:user_id/rooms/:room_id', passportConf.is_authenticated_api, roomController.delete_room_api);
//      Snapdragon
app.get('/api/user/:user_id/snapdragons/rooms/:room_id', passportConf.is_authenticated_api, snapController.get_snapdragons_api);
app.get('/api/user/:user_id/snapdragons/:snapdragon_ip', passportConf.is_authenticated_api, snapController.get_snapdragon_api);
//For POSTING a snapdragon, header is roomId but because the main identfier/key for the
//Room is the Room name, it should be changed to roomName. Also, now it should be easy to make sure
//the room name exist in the database, else cant add snapdragon <<< NEED TO IMPLEMENT
app.post('/api/user/:user_id/snapdragons', passportConf.is_authenticated_api, snapController.post_snapdragon_api);
//SHould we include the room name? i dont think the user should be able to chage the room name thru the snapdragon put
//and if they do then it must be linked to the room databse to chnage it as well (relational integrity) 
//DRAW ER MODEL to show dependencies
app.put('/api/user/:user_id/snapdragons/:snapdragon_ip', passportConf.is_authenticated_api, snapController.edit_snapdragon_api);
app.delete('/api/user/:user_id/snapdragons/:snapdragon_ip', passportConf.is_authenticated_api, snapController.delete_snapdragon_api);

//app.get('/api/')

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
