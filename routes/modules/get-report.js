'use strict';

var events = require('events');

function process (req, res) {
	var workflow = new events.EventEmitter();
	var resArray = [];

	workflow.outcome = {
	    success: false,
	    errfor: {}
	};

	workflow.on('getReport', function(req, res) {
	    var ReportModel = req.app.db.model.Report;

	    ReportModel.find({
	    		'testmodetext' : req.params.key
	    	}, function (err, reports) {

	    	if (err) {
	    		workflow.outcome.success = false;
	    		workflow.outcome.errfor.hasReports = false;
	    		workflow.outcome.errfor.info = 'DB: get report error';
	    		workflow.emit('response', req, res);	    
	    	} 

	    	if ( reports.length === 0 ) {
	    		workflow.outcome.success = false;
	    		workflow.outcome.errfor.hasReports = false;
	    		workflow.emit('response', req, res);    		
	    	} else {
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

	    		workflow.outcome.success = true;
	    		workflow.outcome.errfor.hasReports = true;
		    	workflow.emit('response', req, res);
		    }    	
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

	workflow.emit('getReport', req, res);
}

exports.process = process;