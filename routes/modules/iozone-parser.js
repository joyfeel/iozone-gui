'use strict';

var childProcess = require('child_process');
var events = require('events');

var xlsx = require('node-xlsx');
//Store the parsed data
var dataFolder = './statistical/';

function process (req, res) {
	var workflow = new events.EventEmitter();
	var measuredata = [];

	workflow.outcome = {
	    success: false,
	    errfor: {}
	};

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

		//For MAC
		childProcess.exec('iozone -I -f /mmc/tmp -a ' +
		//For Ubuntu
		//childProcess.exec('iozone3_430_Native/iozone -I -f /mmc/tmp -a ' +
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
			speedStart,
			self = this;

		console.log(obj);

		console.log(JSON.stringify(obj));

		var recLength = obj[0].data[0].length,
			speedLength = obj[0].data[1].length;

		switch (req.body.testmodetext) {
			case 'write':
				speedStart = obj[0].data[1];
				break;
			case 're-write':
				speedStart = obj[0].data[4];
				break;
			case 'read':
				speedStart = obj[0].data[7];
				break;
			case 're-read':
				speedStart = obj[0].data[10];
				break;
			case 'random-read':
				speedStart = obj[0].data[7];
				break;
			case 'random-write':
				speedStart = obj[0].data[10];
				break;																				
		}

		//var speedStart = obj[0].data[1];
/*
		var recStart = obj[0].data[0],
			speedStart = obj[0].data[1];
*/
		//The first data is always 4096
		for (i = 0 + 1; i < Math.min(speedLength, recLength); i++) {
			//measuredata.push([recStart[i], speedStart[i]]);
			measuredata.push(speedStart[i]);
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
			emmcID: req.body.emmcID,
			flashID: req.body.flashID
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
		console.log(reportname);
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

	workflow.emit('validation', req, res);
}

exports.process = process;