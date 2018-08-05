var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.basedir = path.join(__dirname, 'public');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// setup firebase access
var firebase = require("firebase");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAFikaCMhlHKuowqp-84gTxay5Ki96D7V4",
  authDomain: "plantnation-47.firebaseapp.com",
  databaseURL: "https://plantnation-47.firebaseio.com",
  projectId: "plantnation-47",
  storageBucket: "",
  messagingSenderId: "838187907280"
};
firebase.initializeApp(config);

// setup arduino for connection using johnny-five
var five = require('johnny-five'),board,led;
board = new five.Board({port: "/dev/cu.usbmodem1411"});
board.on("ready", function(){

	// Initialize the RGB LED
	led = new five.Led.RGB({
	pins: { // pin numbers
	red: 6,
	green: 5,
	blue: 3
	},
	isAnode: true,
	});

	// test
	led.color({red: 255, blue: 255, green: 255});

	led.off();



	console.log("board is ready");
});

// app.get requests on /on triggers turning LED on
app.get('/on', function(req, res){
	console.log('LED on');
	if(board.isReady){
		led.on();
	};
	res.redirect('/');
});

// app.get requests on /off triggers turning LED off
app.get('/off', function(req, res){
	console.log('LED off');
	if(board.isReady){
		led.off();
	};	
	res.redirect('/');
});

// app.get requests on /red triggers turning LED red
app.get('/:food/:focus', function(req, res){
	if(board.isReady){		
		console.log(req.params);
		console.log(req.params.food);
		switch (req.params.focus) {
		  case 'size':
		    console.log('Growing BIG tomatoes');
		    led.color({red: 0, blue: 0, green: 255});
		    break;
		  case 'sweetness':
		    console.log('Growing SWEET tomatoes');
		    led.color({red: 0, blue: 255, green: 0});
		    break;
		  case 'yield':
		    console.log('Growing LOTS OF tomatoes');
		    led.color({red: 255, blue: 255, green: 255});
		    break;
		  case 'aesthetic':
		    console.log('Growing PRETTY tomatoes');
		    led.color({red: 255, blue: 0, green: 0});
		    break;
		  default:
		    console.log('Standard tomatoes.');
		    led.color({red: 255, blue: 255, green: 255});
		}
		led.on();
	};	
	res.redirect('/');
});




// pubnub.addListener({
//     message: function(m) {
//         // handle message
//         var channelName = m.channel; // The channel for which the message belongs
//         var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
//         var pubTT = m.timetoken; // Publish timetoken
//         var msg = m.message; // The Payload
//         var publisher = m.publisher; //The Publisher

//         var red = m.brightness : r;
//         var green = m.brightness : g;
//         var blue = m.brightness : b;
//     },
//     presence: function(p) {
//         // handle presence
//         var action = p.action; // Can be join, leave, state-change or timeout
//         var channelName = p.channel; // The channel for which the message belongs
//         var occupancy = p.occupancy; // No. of users connected with the channel
//         var state = p.state; // User State
//         var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
//         var publishTime = p.timestamp; // Publish timetoken
//         var timetoken = p.timetoken;  // Current timetoken
//         var uuid = p.uuid; // UUIDs of users who are connected with the channel

//         led.color({red: r, blue: b, green: g});
//     },
//     status: function(s) {
//         var affectedChannelGroups = s.affectedChannelGroups;
//         var affectedChannels = s.affectedChannels;
//         var category = s.category;
//         var operation = s.operation;
//     }
// });

// pubnub.subscribe({
//     channels: ['smart-led'],
// });




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
