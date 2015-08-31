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

mongoose.connect ('mongodb://localhost:27017/test21');
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
	firmware_version: {type: Date, default: Date.now},
	IC_version: { type: String },
	plant: { type: Number },
	factory: { type: String },
	flashes: [{ type: Schema.Types.ObjectId, ref: 'Flash' }]
});

var flashSchema = new Schema({
	flashID: { type: String },
	company: { type: String },
	emmcs: [{ type: Schema.Types.ObjectId, ref:'Emmc' }]
});

var reportSchema = new Schema({
	name: { type: String, unique: true },
	description: { type: String },
	testmode: { type: String },
	size: { type: String },
	recordSize: {type: String},
	data: [],
	emmcId: {type: Schema.Types.ObjectId, ref: 'Emmc'}
});

var Emmc = mongoose.model('Emmc', emmcSchema),
	Flash = mongoose.model('Flash', flashSchema),
	Report = mongoose.model('Report', reportSchema);


var ParentSchema = new Schema({
	firmware_version: {type: String},
	IC_version: { type: String },
	plant: { type: Number },
	factory: { type: String },
    children:[{ type:Schema.ObjectId, ref:"Child" }]
});

ParentSchema.index({ 
	firmware_version: 1, 
	IC_version: 1, 
	plant: 1,
	factory: 1
}, {
	unique: true
});

//Validator
//ParentSchema.plugin(uniqueValidator);

var Parent = mongoose.model("Parent", ParentSchema);

var ChildSchema = new Schema({
	flashID: { type: String },
	company: { type: String },
    parents: [{ type:Schema.ObjectId, ref:"Parent", childPath:"children" }]
});

ChildSchema.index({ 
	flashID: 1, 
	company: 1
}, {
	unique: true
});

ChildSchema.plugin(relationship, { relationshipPathName:'parents' });
var Child = mongoose.model("Child", ChildSchema)







app.db = {
  model: {
  	Emmc: Emmc,
    Flash: Flash,
    Report: Report,
    Parent: Parent,
    Child: Child
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


/*
var postSchema = new mongoose.Schema({
  title  :  { type: String },
  content   :  { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  timeCreated: { type: Date, default: Date.now }
});

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true, select: false  },
  displayName: { type: String, unique: true },
  email: { type: String, unique: true, select: false  },
  timeCreated: { type: Date, default: Date.now, select: false },
  facebook: { type: Object, select: false }
});
*/




/*
var postSchema = new mongoose.Schema({
  title  :  { type: String },
  content   :  { type: String }
});
var Post = mongoose.model('post', postSchema);

var PostEntity = new Post ({
  title: 'Meow!!!',
  content: 'Hello!!!!!!'
});

PostEntity.save(function(err, doc) {
  if (err) {
    console.log('db save err' + err);
  } else {
    console.log('db save successfully' + doc);
  }
});
*/

module.exports = app;
