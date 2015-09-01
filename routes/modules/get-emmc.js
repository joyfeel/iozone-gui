"use strict";

var events = require('events');
var workflow = new events.EventEmitter();

workflow.outcome = {
    success: false,
    errfor: {}
};

workflow.on('query_db', function(req, res) {
	console.log("Query the db");

	var EmmcModel = req.app.db.model.Emmc,
		FlashModel = req.app.db.model.Flash;

	EmmcModel.find(function(err, emmcs) {
		if (err) {
			console.log('DB: Find emmc error');
			console.log(err);
		} else {
			console.log(emmcs);

			emmcs.forEach(function(emmc) {
				console.log('Firmware Version: ' + emmc.firmware_version);
				console.log('IC Version: ' + emmc.IC_version);
				console.log('Plant number: ' + emmc.plant);
				console.log('Factory: ' + emmc.factory);

				console.log('XDD: ' + emmc.flashes);
			});
		}
	});
	
	workflow.emit('response', req, res);
});

workflow.on('response', function(req, res) {
	console.log("Response@.@");

	return res.status(200).json({
		devices: [{
			emmc_id: '1111111111111',
			emmc_content: 'emmc 5ddl test'
		}, {
			emmc_id: '222222222222222',
			emmc_content: 'emmc 6ddl test'
		}, {
			emmc_id: '33333333333333',
			emmc_content: 'emmc 7ddl test'			
		}]
	});
});

function get (req, res) {
	console.log("Flow start");
	return workflow.emit('query_db', req, res);
}

//res.status(200).json({status:"ok"});
//res.status(500).json({status:"not ok"})

exports.get = get;