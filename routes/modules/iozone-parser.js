"use strict";

var child_process = require('child_process');
var events = require('events');

var xlsx = require('node-xlsx');
var fs = require('fs');
var json2csv = require('json2csv');

var workflow = new events.EventEmitter();

//Store the parsed data
var data_folder = "./statistical/"

workflow.outcome = {
    success: false,
    errfor: {}
};

workflow.on('iozone-exec', function(req_body, res) {
	var self = this;
	var filename = data_folder + req_body.filename;

	child_process.exec("iozone3_430_Native/iozone -I -f /mmc/tmp -a "
		+ req_body.testmode + " -s " + req_body.filesize
		+ " -y 4k -q 16m"// + req_body.filesize
		+ " -b " + filename + ".xlsx"
		, function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
			if (error) {
				console.log('exec error: ' + error);
				return res.status(500).send(workflow.outcome)
			} else {
                self.emit('convert_csv', res, req_body, filename);
			}
		}
	);	
});

workflow.on('convert_csv', function(res, req_body, filename) {
	var self = this;

	child_process.exec("ssconvert " + filename + ".xlsx " +  filename + "_convert_csv.csv"
		, function (error, stdout, stderr) {
			//console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
			if (error) {
				console.log('exec error: ' + error);
				return res.status(500).send(workflow.outcome)
			} else {
                self.emit('convert_xlsx', res, req_body, filename);
			}
		}
	);
});

workflow.on('convert_xlsx', function(res, req_body, filename) {
	var self = this;

	child_process.exec("ssconvert " + filename + "_convert_csv.csv " +  filename + "_convert_xlsx.xlsx"
		, function (error, stdout, stderr) {
			//console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
			if (error) {
				console.log('exec error: ' + error);
				return res.status(500).send(workflow.outcome)
			} else {
                self.emit('iozone-save', res, req_body, filename);
			}
		}
	);
});

//Need refactorory.
workflow.on('iozone-save', function(res, req_body, filename) {
	var obj = xlsx.parse(filename + '_convert_xlsx.xlsx'),
		excel_data = [],
		i,
		self = this,
		csv_write_file;

	var rec_length = obj[0].data[0].length,
		speed_length = obj[0].data[1].length;

	var rec_start = obj[0].data[0],
		speed_start = obj[0].data[1];

	var csv_fields = ['speed', 'rec'];

	
	for (i = 0 + 1; i < Math.min(speed_length, rec_length); i++) {
		excel_data.push({speed: speed_start[i]
							, rec: rec_start[i]});
	}
 
	json2csv({ data: excel_data, fields: csv_fields }, function(err, csv) {
	    if (err) {
	    	console.log(err);
	    	return res.status(500).send(workflow.outcome)
	    }
	    self.emit('removefile', res, req_body, filename, csv);
	});
});

workflow.on('removefile', function(res, req_body, filename, csv) {
	var self = this;

	child_process.exec("rm -rf " + filename + "*"
		, function (error, stdout, stderr) {
			//console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
			if (error) {
				console.log('rm -rf error: ' + error);
				return res.status(500).send(workflow.outcome)
			} 
			console.log('Remove file OK!');
			self.emit('writefile', res, req_body, filename, csv);
		}
	);
});

workflow.on('writefile', function(res, req_body, filename, csv) {
	var self = this;

	fs.writeFile(filename + '.csv', csv, function(err) {
		if (err) {
			console.log(err);
			return res.status(500).send(workflow.outcome);
		}
		console.log('Write OK!');
		self.emit('response', res);
	});
});


workflow.on('response', function(res) {
	//Success
    workflow.outcome.success = true;
    return res.status(200).send(workflow.outcome);
});


function process (req_body, res) {
	return workflow.emit('iozone-exec', req_body, res);
}

exports.process = process;