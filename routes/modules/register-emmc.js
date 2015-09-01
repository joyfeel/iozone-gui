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
	var Emmc = req.app.db.model.Emmc,
		Flash = req.app.db.model.Flash,
		ParentModel = req.app.db.model.Parent,
		ChildModel = req.app.db.model.Child;

	var parentInstance = new ParentModel({
		firmware_version: req.body.firmware_version,
		IC_version: req.body.ic_version,
		plant: req.body.plant,
		factory: req.body.factory
	});

	var childInstance = new ChildModel({
		flashID: req.body.flash_id,
		company: req.body.flash_company
	});

	ParentModel.findOne({
		firmware_version: req.body.firmware_version,
		IC_version: req.body.ic_version,
		plant: req.body.plant,
		factory: req.body.factory
	}, function (err, emmc) {
		if (err) {
			return res.status(500).json({status:"not ok"})
		}
		if (emmc == null) {
			parentInstance.save(function(err, new_emmc) {
				ChildModel.findOne({
					flashID: req.body.flash_id,
					company: req.body.flash_company
				}, function (err, flash) {
					if (err) {
						return res.status(500).json({status:"not ok"})
					}					
					if (flash == null) {
						childInstance.parents.push(parentInstance);
						childInstance.save();
					} else {
					     ParentModel.findByIdAndUpdate (
					     	new_emmc._id, 
					     	{ $push: { "children": flash } },
					    	{ safe: true, upsert: true },
					       	function(err, find_emmc) {	         					         
					        	ChildModel.findByIdAndUpdate (flash._id, 
				        			{ $push: {"parents": find_emmc} }, 
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
			ChildModel.findOne({
				flashID: req.body.flash_id,
				company: req.body.flash_company
			}, function (err, flash) {
 				if (err) {
 					return res.status(500).json({status:"not ok"})
 				}				
				if (flash == null) {
					childInstance.parents.push(emmc);
					childInstance.save();
				} else {
					//Update
				     ParentModel.findByIdAndUpdate (
				     	emmc._id, 
				     	{ $addToSet: { "children": flash } },
				    	{ safe: true, upsert: true, unique: true},
				       	function(err, find_emmc) {	         					         
				        	ChildModel.findByIdAndUpdate (flash._id, 
			        			{ $addToSet: {"parents": find_emmc} }, 
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
