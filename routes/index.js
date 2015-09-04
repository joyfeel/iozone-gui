'use strict';

var express = require('express');
var router = express.Router();

//var d3 = require('d3');

var iozone = require('./modules/iozone-parser.js');
var registerEmmc = require('./modules/register-emmc.js');
var getEmmc = require('./modules/get-emmc.js');

var getReport = require('./modules/get-report.js');

//res.status(200).json({status:"ok"});
//res.status(500).json({status:"not ok"})


router.post('/iozone-register', function(req, res, next) {
    console.log('Register...');

    return registerEmmc.store(req, res);
});

//front-end to back-end
router.get('/iozone-input', function(req, res, next) {
    console.log('Get the data from db to generate the emmc & flash field');
    //return res.status(200).json({status:"ok"});  

    return getEmmc.get(req, res);
});


//front-end to back-end
router.post('/iozone-input', function(req, res, next) {
    console.log('Press save');
    return iozone.process (req, res);  
});


//back-end to front-end
router.get('/iozone-report', function(req, res, next) {
    console.log('Get report');

    return getReport.process (req, res);
});


router.delete('/iozone-report/:id', function(req, res, next) {
  console.log('YAlkjdlkajsdlsakd');

/*
  req.app.db.model.Post.findByIdAndRemove(req.params.id, function(err, posts) {
    res.json(posts);
  });
*/
});


/* GET home page. */
router.get('/', function(req, res, next) {
  
    res.redirect('/public/index.html');
});



router.get('/chatroom', function(req, res, next) {
    res.render('chatroom');
});


router.post('/123/contact/1', function(req, res, next) {
  console.log('backend 1@@!!!');
  
  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.message);

  res.render('contact', { 
  					    name: req.body.name,
  						  email: req.body.email,
                        message: req.body.message
  					});
  
  console.log('backend 2!!!');
});

router.get('/chatroom', function(req, res, next) {
    res.render('chatroom');
});

module.exports = router;