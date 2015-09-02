"use strict";

var events = require('events');
var workflow = new events.EventEmitter();

var device_content_array = [];

workflow.outcome = {
    success: false,
    errfor: {}
};

workflow.on('readDB', function (req, res) {
	var EmmcModel = req.app.db.model.Emmc,
		FlashModel = req.app.db.model.Flash;

	EmmcModel.find({})
		.populate('flashes')
		.exec(function(err, emmcs) {
		 	emmcs.forEach(function (emmc) {
		 		var emmc_info = emmc.IC_version + '/' +
		 						emmc.firmware_version + '/' +
		 						emmc.plant + 'CE/' + 
		 						emmc.factory + '/';

				emmc.flashes.forEach(function (flash) {
					var tmp_object = {},
			 			flash_info = flash.company + '/' + flash.flashID,
			 			device_info = emmc_info + flash_info;
					
			 		tmp_object = {
			 			emmc_id : emmc._id,
			 			emmc_content : device_info
			 		};

			 		device_content_array.push(tmp_object);
				});	
		 	});

		 	workflow.emit('response', req, res);
	});
});

workflow.on('response', function (req, res) {
	var response = res.status(200).json({
		devices: device_content_array
	});

	device_content_array.length = 0;

	return response;
});

function get (req, res) {
	console.log("Flow start");
	return workflow.emit('readDB', req, res);
}

//res.status(200).json({status:"ok"});
//res.status(500).json({status:"not ok"})

exports.get = get;