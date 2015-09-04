'use strict';

var events = require('events');


function get (req, res) {
	var workflow = new events.EventEmitter();
	var deviceContentArray = [];

	workflow.outcome = {
	    success: false,
	    errfor: {}
	};

	workflow.on('readDB', function (req, res) {
		var EmmcModel = req.app.db.model.Emmc;

		EmmcModel.find({})
			.populate('flashes')
			.exec(function(err, emmcs) {
			 	emmcs.forEach(function (emmc) {
			 		var emmcInfo = emmc.icVersion + '/' +
			 						emmc.firmwareVersion + '/' +
			 						emmc.plant + 'CE/' + 
			 						emmc.factory + '/';

					emmc.flashes.forEach(function (flash) {
						var tmpObject = {},
				 			flashInfo = flash.company + '/' + flash.flashID,
				 			deviceInfo = emmcInfo + flashInfo;
						
				 		tmpObject = {
				 			test: {
				 				flashID : flash._id,	
				 				emmcID : emmc._id
				 			},
				 			emmcContent : deviceInfo
				 		};

				 		deviceContentArray.push(tmpObject);
					});
			 	});

			 	workflow.emit('response', req, res);
		});
	});

	workflow.on('response', function (req, res) {
		return res.status(200).json({
			devices: deviceContentArray
		});
	});

	workflow.emit('readDB', req, res);
}

//res.status(200).json({status:"ok"});
//res.status(500).json({status:"not ok"})

exports.get = get;