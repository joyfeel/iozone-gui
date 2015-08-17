var child_process = require('child_process');
var events = require('events');
//var XLSX = require('xlsx');

var xlsx = require('node-xlsx');


var excelParser = require('excel-parser');

var fs = require('fs');


var workflow = new events.EventEmitter();

workflow.on('iozone-exec', function(req_body) {
	//console.log("@@@@" + req_body.filesize);
	var self = this;

	child_process.exec("iozone3_430_Native/iozone -a -i 0 -s 1024 -Rab 123.xlsx"
		, function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
			if (error) {
				console.log('exec error: ' + error);
			} else {
                //self.emit('iozone-save');
                self.emit('convert_csv');
			}
		}
	);
	
	console.log("NONONONO");
});

workflow.on('convert_csv', function() {
	var self = this;

	child_process.exec("ssconvert 123.xlsx 123_convert_csv.csv"
		, function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
			if (error) {
				console.log('exec error: ' + error);
			} else {
                self.emit('convert_xlsx');
			}
		}
	);
});

workflow.on('convert_xlsx', function() {
	var self = this;

	child_process.exec("ssconvert 123_convert_csv.csv 123_convert_xlsx.xlsx"
		, function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
			if (error) {
				console.log('exec error: ' + error);
			} else {
                self.emit('iozone-save');
			}
		}
	);
});

workflow.on('iozone-save', function() {
	var obj = xlsx.parse('123_convert_xlsx.xlsx'),
		csv = []
		, i;
	console.log(JSON.stringify(obj));
	console.log("1@" + obj[0].data[0]);
	console.log("length is @" + obj[0].data[0].length);
	console.log("2@" + obj[0].data[0][0]);
	console.log("3@" + obj[0].data[0][1]);
	console.log("4@" + obj[0].data[1]);
	console.log("5@" + obj[0].data[1][0]);
	console.log("6@" + obj[0].data[1][2]);


	
	for (i = 0 + 1; i < obj[0].data[0].length; i++) {
		csv.push({Speed: obj[0].data[1][i]
					, rec_length: obj[0].data[0][i]});

	}

	console.log("csv: " + csv);
	console.log("csv: " + JSON.stringify(csv));

	

	/*
[{"name":"123_convert_csv.csv","data":[[null,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384],[4096,220834,305174,391928,430074,451540,490136,521657,342561,386453,494637,510087],[],[null,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384],[4096,444645,532721,668940,1081568,1055714,1060602,1166934,983436,1144468,1042453,1239330]]}]
1@,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384
2@undefined
3@4
4@4096,220834,305174,391928,430074,451540,490136,521657,342561,386453,494637,510087
5@4096
6@305174


	*/


	/*
	var workbook = XLSX.readFile('123_convert_xlsx.xlsx');
	var sheet_name_list = workbook.SheetNames;
	sheet_name_list.forEach(function(y) { 
	  var worksheet = workbook.Sheets[y];
	  for (z in worksheet) {
	   
	    if(z[0] === '!') continue;
	    console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
	  }
	});
	*/
});

function process (req_body) {
	workflow.emit('iozone-exec', req_body);
}

exports.process = process;