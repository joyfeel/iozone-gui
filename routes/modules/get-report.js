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

	    ReportModel.find({}, function (err, reports) {
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
	    		console.log('Here!!!!!@@');
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
	    	/*
	    	return res.status(200).send([{
	    		devicename: 'D1/20150830/2CE/Meow/Hynix/7ddl',
		        reportname: 'Test case 1',
		        description: 'This is an urgent case',
		        testmodetext: 'write/re-write',
		        filesize: '128m',
		        recordsize: '512k',
		        measuredata:[  
		          [99, 20],
		          [490, 90],
		          [250, 50],
		          [100, 33],
		          [330, 95],
		          [410, 12],
		          [475, 44],
		          [25, 67],
		          [85, 21],
		          [220, 88],
		          [500, 150]
		        ]
		    },{
	    		devicename: 'D1/20150830/2CE/Meow/Hynix/7ddl',
		        reportname: 'Test case 1',
		        description: 'This is an urgent case',
		        testmodetext: 'write/re-write',
		        filesize: '128m',
		        recordsize: '512k',
		        measuredata:[  
		          [5, 20],
		          [490, 90],
		          [250, 50],
		          [100, 33],
		          [330, 95],
		          [410, 12],
		          [475, 44],
		          [25, 67],
		          [85, 21],
		          [220, 88],
		          [500, 150]
		        ]
		    },{
	    		devicename: 'D1/20150830/2CE/Meow/Hynix/7ddl',
		        reportname: 'Test case 1',
		        description: 'This is an urgent case',
		        testmodetext: 'write/re-write',
		        filesize: '128m',
		        recordsize: '512k',
		        measuredata:[  
		          [5, 20],
		          [490, 90],
		          [250, 50],
		          [100, 33],
		          [330, 95],
		          [410, 12],
		          [475, 44],
		          [25, 67],
		          [85, 21],
		          [220, 88],
		          [500, 150]
		        ]
		    },{
	    		devicename: 'D1/20150830/2CE/Meow/Hynix/7ddl',
		        reportname: 'Test case 1',
		        description: 'This is an urgent case',
		        testmodetext: 'write/re-write',
		        filesize: '128m',
		        recordsize: '512k',
		        measuredata:[  
		          [5, 20],
		          [490, 90],
		          [250, 50],
		          [100, 33],
		          [330, 95],
		          [410, 12],
		          [475, 44],
		          [25, 67],
		          [85, 21],
		          [220, 88],
		          [500, 150]
		        ]
		    }]);
			*/
	    } else {
	    	return res.status(500).send(workflow.outcome);
	    } 
	});	

	workflow.emit('validation', req, res);
}

exports.process = process;

/*
	workflow.on('validation', function(req, res) {
	    console.log('validation');

	    if (req.body.devicename.length === 0) {
	    	//console.log('WHY!');
	        workflow.outcome.errfor.info = 'Need to register a device';
	    }

	    if (Object.keys(workflow.outcome.errfor).length !== 0) {
	    	//console.log(Object.keys(workflow.outcome.errfor).length);
	        workflow.outcome.success = false;
	        workflow.emit('response', res);
	    } else {
	    	//console.log('QQ');
	    	workflow.emit('iozone-exec', req, res);		
	    }
	});

	workflow.on('iozone-exec', function(req, res) {
		var self = this;
		var reportname = dataFolder + req.body.reportname;

		childProcess.exec('iozone3_430_Native/iozone -I -f /mmc/tmp -a ' +
				req.body.testmode + ' -s ' + req.body.filesize	+
				' -y 4k -q ' + req.body.recordsize +
				' -b ' + reportname + '.xlsx',
				function (error, stdout, stderr) {
					console.log('stdout: ' + stdout);
					if (error) {
						console.log('exec error: ' + error);
						workflow.outcome.errfor.info = 'sudo mount -t ext4 /dev/mmcblk0 /mmc';
						workflow.outcome.success = false;
						self.emit('response', res);
					} else {
		                self.emit('convert_csv', res, req, reportname);
					}
				}
		);
	});

	workflow.on('convert_csv', function(res, req, reportname) {
		var self = this;

		childProcess.exec('ssconvert ' + reportname + '.xlsx ' +  reportname + '_convert_csv.csv',
			function (error, stdout, stderr) {
				//console.log('stdout: ' + stdout);
	            //console.log('stderr: ' + stderr);
				if (error) {
					console.log('exec error: ' + error);
					workflow.outcome.success = false;
					self.emit('response', res);
				} else {
	                self.emit('convert_xlsx', res, req, reportname);
				}
			}
		);
	});

	workflow.on('convert_xlsx', function(res, req, reportname) {
		var self = this;

		childProcess.exec('ssconvert ' + reportname + '_convert_csv.csv ' +  reportname + '_convert_xlsx.xlsx',
			function (error, stdout, stderr) {
				//console.log('stdout: ' + stdout);
	            //console.log('stderr: ' + stderr);
				if (error) {
					console.log('exec error: ' + error);
					workflow.outcome.success = false;
					self.emit('response', res);
				} else {
	                self.emit('iozone-parser', res, req, reportname);
				}
			}
		);
	});

	//Need refactorory.
	workflow.on('iozone-parser', function(res, req, reportname) {
		var obj = xlsx.parse(reportname + '_convert_xlsx.xlsx'),
			i,
			self = this;

		var recLength = obj[0].data[0].length,
			speedLength = obj[0].data[1].length;

		var recStart = obj[0].data[0],
			speedStart = obj[0].data[1];

		for (i = 0 + 1; i < Math.min(speedLength, recLength); i++) {
			measuredata.push({rec: recStart[i], speed: speedStart[i]});
		}

		self.emit('saveDB', res, req, reportname);
	});


	workflow.on('saveDB', function(res, req, reportname) {
		var self = this;

		var ReportModel = req.app.db.model.Report;

		var reportInstance = new ReportModel({
			devicename: req.body.devicename,
			reportname: req.body.reportname,
			description: req.body.description,
			testmode: req.body.testmode,
			testmodetext: req.body.testmodetext,
			filesize: req.body.filesize,
			recordsize: req.body.recordsize,
			measuredata: measuredata,
			emmcs: req.body.emmcID,
			flashes: req.body.flashID
		});

		reportInstance.save(function (err, newEmmc) {
			if (err) {
				console.log('reportInstance err');

				workflow.outcome.errfor.info = 'save db error';
				workflow.outcome.success = false;
				self.emit('response', res);
			}

			self.emit('removefile', res, reportname);
		});
	});


	workflow.on('removefile', function(res, reportname) {
		var self = this;

		childProcess.exec('rm -rf ' + reportname + '*',
			function (error, stdout, stderr) {
				//console.log('stdout: ' + stdout);
	            //console.log('stderr: ' + stderr);
				if (error) {
					console.log('rm -rf error: ' + error);
					workflow.outcome.errfor.info = 'remove file error';
					workflow.outcome.success = false;
					self.emit('response', res);
				} 
				console.log('Remove file OK!');
				workflow.outcome.success = true;
				self.emit('response', res);
			}
		);
	});

	workflow.on('response', function(res) {
	    if (workflow.outcome.success) {
	    	return res.status(200).send(workflow.outcome);
	    } else {
	    	return res.status(500).send(workflow.outcome);
	    }
	});
*/