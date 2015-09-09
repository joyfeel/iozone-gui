'use strict';

var events = require('events');

function process (req, res) {
	var workflow = new events.EventEmitter();
	var resArray = [], reportLength;

	workflow.outcome = {
	    success: false,
	    errfor: {}
	};

	workflow.on('validation', function(req, res) {
	    console.log('validation');

	    var ReportModel = req.app.db.model.Report;

	    ReportModel.find({
	    		'testmodetext' : req.params.key
	    	}, function (err, reports) {
	    	reportLength = reports.length;

	    	if (err) {
	    		workflow.outcome.success = false;
	    		workflow.outcome.errfor.info = 'DB: get report error';
	    		workflow.emit('response', req, res);	    
	    	} 

    		reports.forEach(function (report) {
    			var objTemp = {};
    			objTemp = {
    				reportID: 		report._id,
		    		devicename: 	report.devicename,
			        reportname: 	report.reportname,
			        description: 	report.description,
			        testmodetext: 	report.testmodetext,
			        filesize: 		report.filesize,
			        recordsize: 	report.recordsize,
			        measuredata:  	report.measuredata		
    			};
    			resArray.push(objTemp);
    		});

    		console.log(resArray);

	    	workflow.emit('getComparedReport', req, res);	    	
	    });
	});

	workflow.on('getComparedReport', function(req, res) {
		var ComparedReportModel = req.app.db.model.ComparedReport;

		ComparedReportModel.find({
				'testmodetext' : req.params.key
			}, function (err, comparedreports) {
			if (err) {
	    		workflow.outcome.success = false;
	    		workflow.outcome.errfor.info = 'DB: get comparedReport error';
	    		workflow.emit('response', req, res);
	    	}

	    	if (comparedreports.length === 0 && reportLength === 0) { 
	    		workflow.outcome.success = false;
	    		workflow.outcome.errfor.info = 'You must at least test one device';
	    	} else {
	    		comparedreports.forEach(function (comparedreport) {
	    			var objTemp = {};

	    			objTemp = {
	    				reportname: 	comparedreport.reportname,
	    				testmodetext: 	comparedreport.testmodetext,
	    				series: 		comparedreport.series
	    			};
	    			resArray.push(objTemp);
	    		});
				workflow.outcome.success = true;		
	    	}

	    	workflow.emit('response', req, res);	    		
		});
	});	

	workflow.on('response', function(req, res) {
	    console.log('response');

	    if (workflow.outcome.success) {
	    	return res.status(200).send(resArray);
	    } else {
	    	return res.status(500).send(workflow.outcome);
	    } 
	});	

	workflow.emit('validation', req, res);
}

exports.process = process;