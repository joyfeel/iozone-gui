//var csvParser = require('csv')
var fs = require('fs');

var csv = require('csv-parser');

var dir = require('node-dir'); 

function process () {
	/*
	fs.readFile('./data.csv', function(err, data) {
		console.log(data);
	});
	*/
	console.log('hihihi');


	fs.createReadStream('./data.csv')
	   .pipe(csv())
	   .on('data', function(data) {
	       console.log(data);
	   });


	/*
	d3.csv('/routes/data.csv', function(error, data) {

        console.log(data);
    });
	*/
}

exports.process = process;