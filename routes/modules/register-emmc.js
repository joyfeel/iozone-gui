"use strict";

var events = require('events');
var workflow = new events.EventEmitter();

workflow.outcome = {
    success: false,
    errfor: {}
};

/*

app.db = {
  model: {
  	Emmc: Emmc,
    Flash: Flash,
    Report: Report
  }
};

var emmcSchema = new Schema({
	firmware_version: {type: Date, default: Date.now},
	IC_version: { type: String },
	plant: { type: Number },
	factory: { type: String },
	flashes: [{ type: Schema.Types.ObjectId, ref: 'Flash' }]
});

var flashSchema = new Schema({
	_creator: { type: Number, ref: 'Flash' },
	flashID: { type: String },
	company: { type: String },
	emmcs: [{ type: Number, ref:'Emmc' }]
});

		this.model.save({
			firmware_version: firmware_version,
			ic_version: ic_version,
			factory: factory,
			flash_id: flash_id,
			plant: plant,
			flash_company: flash_company
		}

*/


//sudo mount -t ext4 /dev/mmcblk0 /mmc
workflow.on('validation', function(req, res) {
	console.log("Flow validation");

	var self = this;
	var Emmc = req.app.db.model.Emmc,
		Flash = req.app.db.model.Flash;

	var emmc = new Emmc({
		//_id: 0,
		firmware_version: req.body.firmware_version,
		IC_version: req.body.ic_version,
		plant: req.body.plant,
		factory: req.body.factory
	});

	console.log("XDDD" + Flash._id);

	//console.log("XDDD1" + req.Flash._id);

	emmc.save(function(err) {
		console.log("Emmc save db...");

		if (err) {
			console.log("Emmc save db error");
			return res.status(500).json({status:"not ok"})
		}

		var flash = new Flash({
			flashID: req.body.flash_id,
			company: req.body.flash_company,
			emmcs : emmc._id
			//_creator: emmc._id
		});

		flash.save(function() {
			console.log("Flash save db...");
			if (err) {
				console.log("Flash save db error");
				return res.status(500).json({status:"not ok"})
			}			
		});

		workflow.emit('response', req, res);
	});
});

workflow.on('response', function(req, res) {
	console.log("Response");

/*
	req.app.db.model.Flash.find({}, function(err, doc) {
		console.log('Meow!!!');
		console.log(doc);

	});
*/
	req.app.db.model.Flash.find({})
	.populate('emmcs')
	.exec(function (err, flash) {
  		if (err) {
  			console.log('WTFFF');
  		}
  		console.log('Meows!!!!');
  		console.log(flash);
  		//console.log(flash.emmcs.factory);

	});

	return res.status(200).json({status:"ok"});
});

function store (req, res) {
	console.log("Flow start");
	return workflow.emit('validation', req, res);
}


//res.status(200).json({status:"ok"});
//res.status(500).json({status:"not ok"})

exports.store = store;