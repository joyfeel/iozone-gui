"use strict";

var events = require('events');
var workflow = new events.EventEmitter();

workflow.outcome = {
    success: false,
    errfor: {}
};

workflow.on('validation', function(req, res) {
	console.log("Flow validation");

	var self = this;
	var EmmcModel = req.app.db.model.Emmc,
		FlashModel = req.app.db.model.Flash;

	var emmcInstance = new EmmcModel({
		firmware_version: req.body.firmware_version,
		IC_version: req.body.ic_version,
		plant: req.body.plant,
		factory: req.body.factory
	});

	var flashInstance = new FlashModel({
		flashID: req.body.flash_id,
		company: req.body.flash_company
	});

	EmmcModel.findOne({
		firmware_version: req.body.firmware_version,
		IC_version: req.body.ic_version,
		plant: req.body.plant,
		factory: req.body.factory
	}, function (err, emmc) {
		if (err) {
			return res.status(500).json({status:"not ok"})
		}
		if (emmc == null) {
			emmcInstance.save(function(err, new_emmc) {
				FlashModel.findOne({
					flashID: req.body.flash_id,
					company: req.body.flash_company
				}, function (err, flash) {
					if (err) {
						return res.status(500).json({status:"not ok"})
					}					
					if (flash == null) {
						flashInstance.emmcs.push(emmcInstance);
						flashInstance.save();
					} else {
					     EmmcModel.findByIdAndUpdate (
					     	new_emmc._id, 
					     	{ $push: { "flashes": flash } },
					    	{ safe: true, upsert: true },
					       	function(err, find_emmc) {	         					         
					        	FlashModel.findByIdAndUpdate (flash._id, 
				        			{ $push: {"emmcs": find_emmc} }, 
				        			{  safe: true, upsert: true }, 
				        			function (err, lol) {
				     	 				if (err) {
				     	 					return res.status(500).json({status:"not ok"})
				     	 				} else {
				     	 					console.log('lol');
				     	 				}
				     	 			}
					     	 	);
					      });
					}
				});
			});
		} else {
			FlashModel.findOne({
				flashID: req.body.flash_id,
				company: req.body.flash_company
			}, function (err, flash) {
 				if (err) {
 					return res.status(500).json({status:"not ok"})
 				}				
				if (flash == null) {
					flashInstance.emmcs.push(emmc);
					flashInstance.save();
				} else {
					//Update
				     EmmcModel.findByIdAndUpdate (
				     	emmc._id, 
				     	{ $addToSet: { "flashes": flash } },
				    	{ safe: true, upsert: true, unique: true},
				       	function(err, find_emmc) {	         					         
				        	FlashModel.findByIdAndUpdate (flash._id, 
			        			{ $addToSet: {"emmcs": find_emmc} }, 
			        			{  safe: true, upsert: true, unique: true}, 
			        			function (err, lol) {
			     	 				if (err) {
			     	 					return res.status(500).json({status:"not ok"})
			     	 				} else {
			     	 					console.log('lol');
			     	 				}
			     	 			}
				     	 	);
				      });
				}
			});
		}		
	});

	workflow.emit('response', req, res);
});

workflow.on('response', function(req, res) {
	console.log("Response");

	return res.status(200).json({status:"ok"});
});

function store (req, res) {
	console.log("Flow start");
	return workflow.emit('validation', req, res);
}

//res.status(200).json({status:"ok"});
//res.status(500).json({status:"not ok"})

exports.store = store;

