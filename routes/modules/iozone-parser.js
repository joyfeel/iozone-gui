var child_process = require('child_process');
var events = require('events');
//var XLSX = require('xlsx');

var xlsx = require('node-xlsx');
var excelParser = require('excel-parser');
var fs = require('fs');
var csvParser = require('csv')
//var jsoncsv = require('json-csv')
var json2csv = require('json2csv');


var workflow = new events.EventEmitter();

workflow.outcome = {
    success: false,
    errfor: {}
};

workflow.on('iozone-exec', function(req_body, res) {
	var self = this;

	child_process.exec("iozone3_430_Native/iozone -a -i 0 -s 256 -Rab 123.xlsx"
		, function (error, stdout, stderr) {
			//console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
			if (error) {
				console.log('exec error: ' + error);
			} else {
                //self.emit('iozone-save');
                self.emit('convert_csv', res);
			}
		}
	);
	
	console.log("NONONONO");
});

workflow.on('convert_csv', function(res) {
	var self = this;

	child_process.exec("ssconvert 123.xlsx 123_convert_csv.csv"
		, function (error, stdout, stderr) {
			//console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
			if (error) {
				console.log('exec error: ' + error);
			} else {
                self.emit('convert_xlsx', res);
			}
		}
	);
});

workflow.on('convert_xlsx', function(res) {
	var self = this;

	child_process.exec("ssconvert 123_convert_csv.csv 123_convert_xlsx.xlsx"
		, function (error, stdout, stderr) {
			//console.log('stdout: ' + stdout);
            //console.log('stderr: ' + stderr);
			if (error) {
				console.log('exec error: ' + error);
			} else {
                self.emit('iozone-save', res);
			}
		}
	);
});

workflow.on('iozone-save', function(res) {
	var obj = xlsx.parse('123_convert_xlsx.xlsx'),
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
	    }
	    //csv_write_file = csv;
	    //console.log(csv);

	    self.emit('writefile', res, csv);
	});

});

workflow.on('writefile', function(res, csv) {
	var self = this;
	fs.writeFile('./data.csv', csv, function(err) {
		if (err) {
			console.log(err);
		}
		console.log('Write OK!');
		self.emit('response', res);
	});
});


workflow.on('response', function(res) {
    workflow.outcome.success = true;
    //return res.send(workflow.outcome);

    return res.status(200).send({
        success: true,
        error: false
    });
});
/*
var myCallback = function () {
	console.log ("ihihihihihi");
};
*/

function process (req_body, res) {
	return workflow.emit('iozone-exec', req_body, res);

	//console.log ("NQNQNQNQNQNQ");
	//myCallback();
}

exports.process = process;