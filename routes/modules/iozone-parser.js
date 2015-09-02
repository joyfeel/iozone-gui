"use strict";

var child_process = require('child_process');
var events = require('events');

var xlsx = require('node-xlsx');
var fs = require('fs');

var workflow = new events.EventEmitter();

//Store the parsed data
var data_folder = "./statistical/"
var measuredata = [];

workflow.outcome = {
    success: false,
    errfor: {}
};

//sudo mount -t ext4 /dev/mmcblk0 /mmc
workflow.on('iozone-exec', function(req, res) {
	var self = this;
	var reportname = data_folder + req.body.reportname;

	child_process.exec("iozone3_430_Native/iozone -I -f /mmc/tmp -a "
			+ req.body.testmode + " -s " + req.body.filesize
			+ " -y 4k -q " + req.body.recordsize // + req.body.filesize
			+ " -b " + reportname + ".xlsx",
			function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				if (error) {
					console.log('exec error: ' + error);
					return res.status(500).send(workflow.outcome)
				} else {
	                self.emit('convert_csv', res, req, reportname);
				}
			}
	);	
});

workflow.on('convert_csv', function(res, req, reportname) {
	var self = this;

	child_process.exec("ssconvert " + reportname + ".xlsx " +  reportname + "_convert_csv.csv"
		, function (error, stdout, stderr) {
			//console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
			if (error) {
				console.log('exec error: ' + error);
				return res.status(500).send(workflow.outcome)
			} else {
                self.emit('convert_xlsx', res, req, reportname);
			}
		}
	);
});

workflow.on('convert_xlsx', function(res, req, reportname) {
	var self = this;

	child_process.exec("ssconvert " + reportname + "_convert_csv.csv " +  reportname + "_convert_xlsx.xlsx"
		, function (error, stdout, stderr) {
			//console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
			if (error) {
				console.log('exec error: ' + error);
				return res.status(500).send(workflow.outcome)
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
		self = this,
		csv_write_file;

	var rec_length = obj[0].data[0].length,
		speed_length = obj[0].data[1].length;

	var rec_start = obj[0].data[0],
		speed_start = obj[0].data[1];

	//var csv_fields = ['rec', 'speed'];

	
	for (i = 0 + 1; i < Math.min(speed_length, rec_length); i++) {
		measuredata.push({rec: rec_start[i], speed: speed_start[i]});
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
		filesize: req.body.filesize,
		recordsize: req.body.recordsize,
		measuredata: measuredata,
		emmcs: req.body.deviceID
	});

	measuredata.length = 0;

	reportInstance.save(function (err, new_emmc) {
		if (err) {
			console.log('reportInstance err');
			console.log(err);
		}

		self.emit('removefile', res, reportname);
	});
});


workflow.on('removefile', function(res, reportname) {
	var self = this;

	child_process.exec("rm -rf " + reportname + "*"
		, function (error, stdout, stderr) {
			//console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
			if (error) {
				console.log('rm -rf error: ' + error);
				return res.status(500).send(workflow.outcome)
			} 
			console.log('Remove file OK!');
			self.emit('response', res);
		}
	);
});

workflow.on('response', function(res) {
	//Success
    workflow.outcome.success = true;
    return res.status(200).send(workflow.outcome);
});

function process (req, res) {
	return workflow.emit('iozone-exec', req, res);
}

exports.process = process;