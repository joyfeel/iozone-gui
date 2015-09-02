"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'),
 	relationship = require("mongoose-relationship"),
	uniqueValidator = require('mongoose-unique-validator');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

mongoose.connect ('mongodb://localhost:27017/test123');
mongoose.connection.on('error', function() {
  console.log('MongoDB: error');
});

mongoose.connection.on('open', function() {
  console.log('MongoDB: connected');
});


var Schema = mongoose.Schema;

/**MongoDB
 *
 */
var emmcSchema = new Schema({
	firmware_version: {type: String},
	IC_version: { type: String },
	plant: { type: Number },
	factory: { type: String },
    flashes:[{ type:Schema.ObjectId, ref:"Flash"}]
    //?????????????
    //reports:[{ type:Schema.ObjectId, ref:"Report" }]
});

emmcSchema.index({ 
	firmware_version: 1, 
	IC_version: 1, 
	plant: 1,
	factory: 1
}, {
	unique: true
});

//Validator
//emmcSchema.plugin(uniqueValidator);

var Emmc = mongoose.model("Emmc", emmcSchema);

var flashSchema = new Schema({
	flashID: { type: String },
	company: { type: String },
    emmcs: [{ type:Schema.ObjectId, ref:"Emmc", childPath:"flashes"}]
});

flashSchema.index({ 
	flashID: 1, 
	company: 1
}, {
	unique: true
});

flashSchema.plugin(relationship, { relationshipPathName:'emmcs' });
var Flash = mongoose.model("Flash", flashSchema);

var reportSchema = new Schema({
	devicename: { type: String },
	deviceID: {type: String},
	reportname: { type: String},
	description: { type: String },
	testmode: { type: String },
	filesize: { type: String },
	recordsize: {type: String},
    measuredata: { type : Array , "default" : [] },
	emmcs: { type:Schema.ObjectId, ref:"Emmc", childPath:"reports" }
});

reportSchema.plugin(relationship, { relationshipPathName:'emmcs' });
var Report = mongoose.model('Report', reportSchema);

app.db = {
  model: {
  	Emmc: Emmc,
    Flash: Flash,
    Report: Report
  }
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('uinexpress').__express);
app.set('view engine', 'html');


//Mark the 'jade' template
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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