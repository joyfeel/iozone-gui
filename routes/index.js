'use strict';

var express = require('express');
var router = express.Router();

//var d3 = require('d3');

var iozone = require('./modules/iozone-parser.js');
var registerEmmc = require('./modules/register-emmc.js');
var getEmmc = require('./modules/get-emmc.js');

var getReport = require('./modules/get-report.js');
var getComparedReport = require('./modules/get-compared-report.js');

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

    return iozone.process(req, res);  
});

router.get('/iozone-report', function(req, res, next) {
    console.log('XXXXX');

    return getReport.process(req, res);
});

router.get('/iozone-report/:key', function(req, res, next) {
    console.log('YYYYY');

    return getReport.process(req, res);
});

router.get('/iozone-compared-report', function(req, res, next) {
    console.log('WWWWW');

    return getComparedReport.process(req, res);
});

router.get('/iozone-compared-report/:key', function(req, res, next) {
    console.log('EEEEE');

    return getComparedReport.process(req, res);
});


router.delete('/iozone-report/:key/:id', function(req, res, next) {
    /*
    console.log('DElete');
    console.log(req.params.key.id);
    console.log(req.params.id);
    console.log(req.params.key);
    */
    console.log('AAAAA');
    var outcome = {
        success: false,
        errfor: {}
    };

    var ReportModel = req.app.db.model.Report;

    ReportModel.findByIdAndRemove(req.params.id, function(err, report) {
        if (err) {
            outcome.errfor.info = 'DB: Delete the report error';
            return res.status(500).send(outcome);
        }

        outcome.success = true;
        return res.status(200).send(outcome);                
    });

});

router.delete('/iozone-report/:id', function(req, res, next) {
    /*
    console.log('DElete');
    console.log(req.params.id);
    */
    console.log('BBBBB');
    var outcome = {
        success: false,
        errfor: {}
    };

    var ReportModel = req.app.db.model.Report;

    ReportModel.findByIdAndRemove(req.params.id, function(err, report) {
        if (err) {
            outcome.errfor.info = 'DB: Delete the report error';
            return res.status(500).send(outcome);
        } 

        outcome.success = true;
        return res.status(200).send(outcome);                
    });

});




/*
router.delete('/iozone-compared-report/:key/:id', function(req, res, next) {
    
    console.log('DElete');
    console.log(req.params.key.id);
    console.log(req.params.id);
    console.log(req.params.key);
    
    console.log('CCCCC');
    var outcome = {
        success: false,
        errfor: {}
    };

    var ComparedReport = req.app.db.model.ComparedReport;


    ComparedReport.findByIdAndRemove(req.params.id, function(err, comparedReport) {
        if (err) {
            outcome.errfor.info = 'DB: Delete the report error';
            return res.status(500).send(outcome);
        }

        outcome.success = true;
        return res.status(200).send(outcome);                
    });

});
*/

router.delete('/iozone-compared-report/:id', function(req, res, next) {
    var outcome = {
        success: false,
        errfor: {}
    };

    var ComparedReport = req.app.db.model.ComparedReport;

    ComparedReport.findByIdAndRemove(req.params.id, function(err, comparedReport) {
        if (err) {
            outcome.errfor.info = 'DB: Delete the report error';
            return res.status(500).send(outcome);
        } 

        outcome.success = true;
        return res.status(200).send(outcome);                
    });

});

router.post('/iozone-compared-report', function(req, res, next) {
    console.log('/iozone-report/post');
    console.log(JSON.stringify(req.body));

    var outcome = {
        success: false,
        errfor: {}
    };

    var ComparedReport = req.app.db.model.ComparedReport;

    var comparedreportInstance = new ComparedReport({
        reportname: req.body.reportname,
        testmodetext: req.body.testmodetext,
        series: req.body.series
    });

    comparedreportInstance.save(function (err, doc) {
        if (err) {
            outcome.errfor.info = 'DB: Save the comparedreport error';
            return res.status(500).send(outcome);
        }

        outcome.success = true;
        return res.status(200).send(outcome);
    });
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