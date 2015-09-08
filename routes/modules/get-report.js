'use strict';

var events = require('events');

function process (req, res) {
	var workflow = new events.EventEmitter();
	var resArray = [];

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
	    	if (err) {
	    		workflow.outcome.success = false;
	    		workflow.outcome.errfor.info = 'DB error';
	    		workflow.emit('response', req, res);	    
	    	} 

	    	if (reports.length === 0) {
	    		workflow.outcome.success = false;
	    		workflow.outcome.errfor.info = 'You must at least test one device';
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
        		workflow.emit('response', req, res);		
	    	}
	    	
	    });
	});

	/*
var reportSchema = new Schema({
	devicename: { type: String },
	reportname: { type: String},
	description: { type: String },
	testmodetext: { type: String },
	filesize: { type: String },
	recordsize: {type: String},
    measuredata: { type : Array , "default" : [] },
	emmcID: { type:Schema.ObjectId, ref:"Emmc", childPath:"reports" },
	flasheID: { type:Schema.ObjectId, ref:"Flash", childPath:"reports" }
});
	*/

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