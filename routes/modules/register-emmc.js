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
		if (emmc == null) {
			parentInstance.save(function(err, qq) {
				ChildModel.findOne({
					flashID: req.body.flash_id,
					company: req.body.flash_company
				}, function (err, flash) {
					if (flash == null) {
						childInstance.parents.push(parentInstance);
						childInstance.save();

						//parentInstance.save();
						//parentInstance.children.push(flash);
					} else {

					}

				});
			});
		} else {
			ChildModel.findOne({
				flashID: req.body.flash_id,
				company: req.body.flash_company
			}, function (err, flash) {
				if (flash == null) {
					/*
					childInstance.parents.push(emmc);
					childInstance.save();

					emmc.children.remove(childInstance);
					emmc.save();
					*/
					childInstance.parents.push(emmc);
					childInstance.save(function(err, qq) {
						if (err) {
							console.log('WHY???');
							/*
							emmc.children.remove(childInstance);
							emmc.save();
							*/
						} else {
							console.log('QQQQQ1');
							
							console.log('QQQQQ2');
							console.log(qq);
							console.log('QQQQQ3');
							console.log(childInstance);
							console.log('QQQQQ4');
							console.log(parentInstance);	
							console.log('QQQQQ5');
							console.log(emmc);		
							emmc.children.remove(qq);											
							emmc.save(function(err, doc) {});
							/*
							parentInstance.children.remove(qq);											
							parentInstance.save(function(err, doc) {});
							*/
							/*
							childInstance
							console.log(childInstance);
							*/
						}
					});
				} else {

				}
			});
			/*
			childInstance.parents.push(emmc);
			childInstance.save(function(err, qq) {
				if (err) {
					emmc.children.remove(childInstance);
					emmc.save(function(err, doc) {});
				} else {
					console.log(childInstance);
				}
			});
			*/
		}		

	});



/*
	ChildModel.findOne({
		flashID: req.body.flash_id,
		company: req.body.flash_company
	}, function(err, flash) {
		if (err) {
			console.log(err);
		} else {
			console.log("@@@@@@");
			console.log(flash);
			console.log("@@@@@@2");
			parentInstance.children.push(flash);
			console.log("@@@@@@3");
		}
	});




	parentInstance.save(function(err, innerparent) {
		if (err) {
			console.log(err);

			ParentModel.findOne({
				firmware_version: req.body.firmware_version,
				IC_version: req.body.ic_version,
				plant: req.body.plant,
				factory: req.body.factory
			}, function(err, emmc) {
				console.log(emmc);
				if (err) {
					console.log(err);
				} else {
					childInstance.parents.push(emmc);
					childInstance.save(function(err, qq) {
						if (err) {
							emmc.children.remove(childInstance);
							emmc.save(function(err, doc) {});
						} else {
							console.log(childInstance);
						}
					});
				}
			});

		} else {
			childInstance.parents.push(parentInstance);
			childInstance.save(function(err, innerchild) {
				if (err) {
					console.log(err);
				} else {
					console.log(innerchild);
				}
			});
		}
	});
*/


	/*
	var parentTwo = new Parent({});
	parentTwo.save();
	*/

	//Need to push the old data


/*
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

		
	});
*/

	workflow.emit('response', req, res);
});

workflow.on('response', function(req, res) {
	console.log("Response");

/*
	req.app.db.model.Flash.find({}, function(err, doc) {
		console.log('Meow!!!');
		console.log(doc);

	});
*/

/*
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
*/
	return res.status(200).json({status:"ok"});
});

function store (req, res) {
	console.log("Flow start");
	return workflow.emit('validation', req, res);
}


//res.status(200).json({status:"ok"});
//res.status(500).json({status:"not ok"})

exports.store = store;