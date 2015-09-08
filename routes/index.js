'use strict';

var express = require('express');
var router = express.Router();

//var d3 = require('d3');

var iozone = require('./modules/iozone-parser.js');
var registerEmmc = require('./modules/register-emmc.js');
var getEmmc = require('./modules/get-emmc.js');

var getReport = require('./modules/get-report.js');

//return res.status(200).json({status:'ok'});
//return res.status(500).json({status:'not ok'})


/* GET home page. */
router.get('/', function(req, res, next) {
  
    res.redirect('/public/index.html');
});


router.post('/iozone-register', function(req, res, next) {

    return registerEmmc.store(req, res);
});

//front-end to back-end
router.get('/iozone-input', function(req, res, next) {

    return getEmmc.get(req, res);
});

router.post('/iozone-input', function(req, res, next) {

    return iozone.process (req, res);  
});

router.get('/iozone-report', function(req, res, next) {

    return getReport.process (req, res);
});

router.get('/iozone-report/:key', function(req, res, next) {

    return getReport.process (req, res);
});

router.delete('/iozone-report/:key/:id', function(req, res, next) {
    console.log('DElete');
    console.log(req.params.key.id);
    console.log(req.params.id);
    console.log(req.params.key);

    var outcome = {
        success: false,
        errfor: {}
    };

    var ReportModel = req.app.db.model.Report;

    ReportModel.findByIdAndRemove(req.params.id, function(err, report) {
        if (err) {
            outcome.errfor.info = 'DB: Delete the report error';
            return res.status(500).send(outcome);
        } else {
            console.log(report);
            outcome.success = true;
            return res.status(200).send(outcome);                
        }
    });

});

router.delete('/iozone-report/:id', function(req, res, next) {
    console.log('DElete');
    console.log(req.params.id);
    var outcome = {
        success: false,
        errfor: {}
    };

    var ReportModel = req.app.db.model.Report;

    ReportModel.findByIdAndRemove(req.params.id, function(err, report) {
        if (err) {
            outcome.errfor.info = 'DB: Delete the report error';
            return res.status(500).send(outcome);
        } else {
            console.log(report);
            outcome.success = true;
            return res.status(200).send(outcome);                
        }
    });

});

router.post('/iozone-report', function(req, res, next) {
    console.log('/iozone-report/post');
    console.log(req.body);

    return res.status(200).json({status:'ok'});
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