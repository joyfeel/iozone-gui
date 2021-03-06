'use strict';

var events = require('events');

function process (req, res) {
	var workflow = new events.EventEmitter();
	var resArray = [];

	workflow.outcome = {
	    success: false,
	    errfor: {}	    
	};

	workflow.on('getComparedReport', function(req, res) {
		var ComparedReportModel = req.app.db.model.ComparedReport;

		ComparedReportModel.find({
				'testmodetext' : req.params.key
			}, function (err, comparedreports) {
			if (err) {
	    		workflow.outcome.success = false;
	    		workflow.outcome.errfor.hasReports = false;
	    		workflow.outcome.errfor.info = 'DB: get comparedReport error';
	    		workflow.emit('response', req, res);
	    	}

	    	if ( comparedreports.length === 0 ) {
	    		workflow.outcome.success = false;
	    		workflow.outcome.errfor.hasReports = false;
	    		workflow.emit('response', req, res);    		
	    	} else {

	    	/*
	    	if (comparedreports.length === 0 && reportLength === 0) { 
	    		workflow.outcome.success = false;
	    		workflow.outcome.errfor.info = 'You must at least test one device';
	    	} else {
	    		comparedreports.forEach(function (comparedreport) {
	    			var objTemp = {};

	    			objTemp = {
	    				reportID: 		comparedreport._id,
	    				reportname: 	comparedreport.reportname,
	    				testmodetext: 	comparedreport.testmodetext,
	    				series: 		comparedreport.series
	    			};
	    			resArray.push(objTemp);
	    		});
				workflow.outcome.success = true;		
	    	}
			*/

	    		comparedreports.forEach(function (comparedreport) {
	    			var objTemp = {};

	    			objTemp = {
	    				reportID: 		comparedreport._id,
	    				reportname: 	comparedreport.reportname,
	    				testmodetext: 	comparedreport.testmodetext,
	    				series: 		comparedreport.series
	    			};
	    			resArray.push(objTemp);
	    		});
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

	workflow.emit('getComparedReport', req, res);
}

exports.process = process;