'use strict';

var events = require('events');
var workflow = new events.EventEmitter();

workflow.outcome = {
    success: false,
    errfor: {}
};

workflow.on('validation', function(req, res) {
	console.log('Flow validation');
	console.log(req.body.firmwareVersion);

	var EmmcModel = req.app.db.model.Emmc,
		FlashModel = req.app.db.model.Flash;

	var emmcInstance = new EmmcModel({
		firmwareVersion: req.body.firmwareVersion,
		icVersion: req.body.icVersion,
		plant: req.body.plant,
		factory: req.body.factory
	});

	var flashInstance = new FlashModel({
		flashID: req.body.flashID,
		company: req.body.flashCompany
	});

	EmmcModel.findOne({
		firmwareVersion: req.body.firmwareVersion,
		icVersion: req.body.icVersion,
		plant: req.body.plant,
		factory: req.body.factory
	}, function (err, emmc) {
		if (err) {
			return res.status(500).json({status:'not ok'});
		}
		if (emmc == null) {
			emmcInstance.save(function(err, newEmmc) {
				FlashModel.findOne({
					flashID: req.body.flashID,
					company: req.body.flashCompany
				}, function (err, flash) {
					if (err) {
						return res.status(500).json({status:'not ok'});
					}					
					if (flash == null) {
						flashInstance.emmcs.push(emmcInstance);
						flashInstance.save();
					} else {
					     EmmcModel.findByIdAndUpdate (
					     	newEmmc._id, 
					     	{ $push: { 'flashes': flash } },
					    	{ safe: true, upsert: true },
					       	function(err, findEmmc) {	         					         
					        	FlashModel.findByIdAndUpdate (flash._id, 
				        			{ $push: {'emmcs': findEmmc} }, 
				        			{  safe: true, upsert: true }, 
				        			function (err, lol) {
				     	 				if (err) {
				     	 					return res.status(500).json({status:'not ok'});
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
				flashID: req.body.flashID,
				company: req.body.flashCompany
			}, function (err, flash) {
 				if (err) {
 					return res.status(500).json({status:'not ok'});
 				}				
				if (flash == null) {
					flashInstance.emmcs.push(emmc);
					flashInstance.save();
				} else {
					//Update
				     EmmcModel.findByIdAndUpdate (
				     	emmc._id, 
				     	{ $addToSet: { 'flashes': flash } },
				    	{ safe: true, upsert: true, unique: true},
				       	function(err, findEmmc) {	         					         
				        	FlashModel.findByIdAndUpdate (flash._id, 
			        			{ $addToSet: {'emmcs': findEmmc} }, 
			        			{  safe: true, upsert: true, unique: true}, 
			        			function (err, lol) {
			     	 				if (err) {
			     	 					return res.status(500).json({status:'not ok'});
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
	console.log('Response');

	return res.status(200).json({status:'ok'});
});

function store (req, res) {
	return workflow.emit('validation', req, res);
}

//res.status(200).json({status:"ok"});
//res.status(500).json({status:"not ok"})

exports.store = store;

