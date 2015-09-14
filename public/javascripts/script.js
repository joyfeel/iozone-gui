'use strict';

//var moments = require('moment');

var app = app || {};

var template = function(id) {
	return _.template($('#' + id).html());
};

app.IozoneInput = Backbone.Model.extend({
	url: function() {
		return 'http://10.5.48.1:3000/iozone-input' +
					(this.id === null ? '' : '/' + this.id);
	},
	id: null,
	defaults: {
		devicename: '',
		emmcID: '',
		flashID: '',
		devices: [],
		reportname: '',
		description: 'Test',
		testmode: '',
		filesize: '',
		recordsize: '',
		data: [],
		success: false,
		errfor: {}
	}
});


/*
var foo = function () {



};

var model = Backbone.Model.extend({


});

var view = Backbone.View.extend({


});

var collection = Backbone.Collection.extend({


});

var routes = Backbone.Router.extend({


});
*/





app.IozoneReport = Backbone.Model.extend({
	urlRoot: '',
	id: null,
	defaults: {
		reportID: '',
		devicename: '',
		reportname: '',
		description: '',
		testmodetext: '',
		filesize: '',
		recordsize: '',
		measuredata: []
	}
});

app.IozoneReportCollection = Backbone.Collection.extend({
	url: function() {
		return 'http://10.5.48.1:3000/iozone-report' +
					(this.id === null ? '' : '/' + this.id);		
	},
	id: null,
	model: app.IozoneReport	
});


app.IozoneComparedReport = Backbone.Model.extend({
	url: function() {
		return 'http://10.5.48.1:3000/iozone-compared-report' +
					(this.id === null ? '' : '/' + this.id);		
	},
	id: null,
	defaults: {		
		reportID: '',
		devicename: '',
		reportname: '',
		description: '',
		testmodetext: '',
		filesize: '',
		recordsize: '',
		measuredata: [],		
		series: []
	}
});

app.IozoneComparedReportCollection = Backbone.Collection.extend({
	url: function() {
		return 'http://10.5.48.1:3000/iozone-compared-report' +
					(this.id === null ? '' : '/' + this.id);		
	},
	id: null,
	model: app.IozoneComparedReport	
});


app.Router = Backbone.Router.extend({
	routes: {
		'about': 				'about',
		'iozone-register': 		'iozoneRegister',
		'iozone-input': 		'iozoneInput',
		'iozone-result': 		'iozoneResult',
		'iozone-result/:key': 	'iozoneResultSingle'
	},
	initialize: function() {
        this.view = null;
    },
	about: function() {
		this._cleanUp();
		this.view = new app.AboutView();
	},
	iozoneRegister: function() {
		this._cleanUp();
		this.view = new app.IozoneRegisterView();
	},
	iozoneInput: function() {
		this._cleanUp();
		this.view = new app.IozoneInputView();
	},
	iozoneResult: function() {
		this._cleanUp();
		this.view = new app.IozoneResultView({
			collection: {
				singleReportCollection: new app.IozoneReportCollection(),
				comparedRportCollection: new app.IozoneComparedReportCollection()
			},
			/*
			collection.singleReportCollection:  new app.IozoneReportCollection(),
			collection.comparedRportCollection: new app.IozoneComparedReportCollection(),
			*/
			id: null
		});
    },
    iozoneResultSingle: function (key) {
		this._cleanUp();
		this.view = new app.IozoneResultView({
			collection: {
				singleReportCollection: new app.IozoneReportCollection(),
				comparedRportCollection: new app.IozoneComparedReportCollection()
			},
			id: key
		});
    },
    _cleanUp: function() {
        if(this.view) {
            this.view.remove();
        }
        this.view = null;
    }
});

app.IozoneUtilityView = Backbone.View.extend({
	template: template('iozone-page-utility-template'),
	render: function () {
		this.$el.html(this.template());

		this.parentView.$el.find('.compare-row').append( this.$el );


		return this;
	}
});

app.IozoneItemView = Backbone.View.extend({
	events: {
		'click .btn-delete-report': 'delete'
	},
	template: template('iozone-report-template'),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		this.d3LineChart(this.model.get('devicename'),
							this.model.get('measuredata'),
							this.model.get('reportname'));

		this.parentView.$el.find('.chart-row').append( this.$el );

		return this;
	},
	d3LineChart: function(devicename, measuredata, reportname) {
		this.$el.find('.myd3-line-chart').highcharts({
	        title: {
	            text: devicename,
	            x: -20 //center
	        },
	        xAxis: {
	            categories: ['4k', '8k', '16k', '32k', '64k', '128k', '256k', '512k']
	        },
	        yAxis: {
	            title: {
	                text: 'Speed (kB/sec)'
	            },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#808080'
	            }]
	        },
	        plotOptions: {
	            series: {
	                allowPointSelect: true
	            }
	            /*
				line: {
	                dataLabels: {
	                    enabled: true
	                },
	                enableMouseTracking: true
	            }
	            */	            
	        },	        
	        tooltip: {
	            //valueSuffix: 'kB/sec'
	            crosshairs: true,
	            formatter: function () {
	            	return 'Speed for <b>' + this.x + '</b> is <b>' + this.y + '</b>';
	            }
	        },
	        legend: {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        },
	        series: [{
	            name: reportname,
	            data: measuredata
	        }],
	        credits: {
      			enabled: false
  			},
  			exporting: {
  				filename: reportname
  			},
  			chart: {
 				borderColor: '#EBBA95',
            	borderWidth: 2,
			    polar: true,
			    type: 'line'
			 }
	    });
	},
	delete: function (e) {
        // now that we need to know, we can just check that attribute
        e.preventDefault();

        var id = $(e.target).data('id');

        var self = this;

		swal({   title: 'Are you sure?',   
			text: 'You will not be able to recover this report!',   
			type: 'warning',   showCancelButton: true,   confirmButtonColor: '#DD6B55',   
			confirmButtonText: 'Yes, delete it!',   closeOnConfirm: false }, 
			function () {   
		        self.model.attributes.id = id;
		        console.log(self.model);

		        self.model.destroy({
		    		success: function () {
		            	swal('Deleted!', 'Your report file has been deleted.', 'success'); 
		        	},
		        	error: function (model, response, options) {
						var responseObj = JSON.parse(response.responseText);
		        		swal('No report!', responseObj.errfor.info, 'error');
		        	}        	
		        });	
			});
    }
});

app.IozoneItemViewTest = Backbone.View.extend({
	events: {
		'click .btn-delete-report': 'delete'
	},	
	template: template('iozone-compared-report-template'),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.d3LineChart(this.model.get('reportname'), this.model.get('series'));

		this.parentView.$el.find('.chart-row').append( this.$el );

		return this;
	},
	d3LineChart: function(reportname, series) {
		this.$el.find('.myd3-line-chart').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
		            text: reportname,
		            //x: -20 //center
	        },
	        xAxis: {
	            categories: ['4k', '8k', '16k', '32k', '64k', '128k', '256k', '512k'],
	            crosshair: true
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Speed (kB/sec)'
	            }
	        },
	        tooltip: {
	            formatter: function () {
	                return 'Speed for <b>' + this.x + '</b> is <b>' + this.point.y + '</b>';
	            }
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: series,
	        credits: {
                enabled: false
            },
            exporting: {
                filename: reportname
            }            
	    });
	},
	delete: function (e) {
        e.preventDefault();

        var id = $(e.target).data('id');

        var self = this;

		swal({   title: 'Are you sure?',   
			text: 'You will not be able to recover this report!',   
			type: 'warning',   showCancelButton: true,   confirmButtonColor: '#DD6B55',   
			confirmButtonText: 'Yes, delete it!',   closeOnConfirm: false }, 
			function () {   
		        //self.model.attributes.id = id;
		        //console.log(self.model.attributes.id );
		        self.model.id = id;
		        self.model.attributes.id = id;
		        console.log(self.model);
		        self.model.destroy({
		    		success: function () {
		            	swal('Deleted!', 'Your report file has been deleted.', 'success'); 
		        	},
		        	error: function (model, response, options) {
						var responseObj = JSON.parse(response.responseText);
		        		swal('No report!', responseObj.errfor.info, 'error');
		        	}        	
		        });	
			});		
    }
});



app.IozoneResultView = Backbone.View.extend({
	el: '#global-div',
	events: {
		'click .btn-compare' : 'compare'
	},
	template: template('iozone-result-template'),
	initialize: function() {

		var hasReport = false,
			hasComparedReport = false;

		var self = this;


		//(1) null
		//(2) write


		//this.template = template('iozone-result-template');
		//this.parentView.$el.find('.chart-row').append( this.$el );


		//var responseObj;
		//this.trigger('spinner');
		
		//_.bindAll(this, 'compare');

		/*
		this.collection.on('change', this.render);
		this.collection.on('add', this.render);
		this.collection.on('remove', this.render);

		*/
		//this.bind('spinner', this.showSpinner, this);

		//this.listenTo(this.collection, 'update', this.render);


		this.listenTo(this.collection.singleReportCollection, 'update', this.render);
		this.listenTo(this.collection.comparedRportCollection, 'update', this.render);
	
		//this.$el.append('<div class="loading">Loading...</div>');
/*
		this.collection.on('reset', function() {
			console.log('@@@@@@@@@@!!!');
      		this.$el.html('<img src="../img/spinner.gif">');
    	}, this);
*/
		//this.render();


/*

			singleReportCollection:  new app.IozoneReportCollection(),
			comparedRportCollection: new app.IozoneReportCollection(),

*/

/*
		this.collection.id = this.id;	
		this.collection.fetch({
    		success: function (model, response, options) {
    			console.log('success');
        	},
        	error: function (model, response, options) {
				var responseObj = JSON.parse(response.responseText);

        		swal('No report!', responseObj.errfor.info, 'error');	
        	}
		});
*/


/*
		this.collection.id = this.id;	
		this.collection.fetch({
    		success: function (model, response, options) {
    			console.log('success');
        	},
        	error: function (model, response, options) {
				var responseObj = JSON.parse(response.responseText);

        		swal('No report!', responseObj.errfor.info, 'error');	
        	}
		});
*/

		this.collection.singleReportCollection.id = this.id;
		this.collection.comparedRportCollection.id = this.id;

		$.when(		
			self.collection.singleReportCollection.fetch({
	    		success: function (model, response, options) {
	    			console.log('When1');
	    			hasReport = true;
	        	},
	        	error: function (model, response, options) {
	        		console.log('When2');
	    			
	    			hasReport = false;
	    			
	    			
	        	}
			}), 		
			self.collection.comparedRportCollection.fetch({
	    		success: function (model, response, options) {
	    			console.log('When3');
	    			hasComparedReport = true;
	    			/*
	    			responseObj = JSON.parse(response.responseText);
	    			hasComparedReport = responseObj.errfor.hasReports;
	    			console.log(hasComparedReport);
	    			*/
	        	},
	        	error: function (model, response, options) {
	        		console.log('When4');

	        		hasComparedReport = false;
	        		/*
	    			responseObj = JSON.parse(response.responseText);
	    			hasComparedReport = responseObj.errfor.hasReports;
	    			console.log(hasComparedReport);
	    			*/
	        	}
			})
		).done(function() {

			console.log('EEEEEEEE');
			console.log(hasReport);
			console.log(hasComparedReport);

			if (!hasReport || !hasComparedReport) {
				swal('No report!', 'Just no!', 'error');	
			}

			//self.render();
		}).fail(function() {
			console.log('XXXXXXXXXX');
			console.log(hasReport);
			console.log(hasComparedReport);			
		});
		/*.done(function() {

			console.log('EEEEEEEE1111');
			console.log(hasReport);
			console.log(hasComparedReport);

			if (!hasReport || !hasComparedReport) {
				swal('No report!', 'Just no!', 'error');	
			}

		}).fail(function() {
			console.log('XXXXXXXXXX1111');
			console.log(hasReport);
			console.log(hasComparedReport);			
		});
		*/

		
/*
		this.collection.singleReportCollection.id = this.id;	
		this.collection.singleReportCollection.fetch({
    		success: function (model, response, options) {
    			console.log('success');
        	},
        	error: function (model, response, options) {
				var responseObj = JSON.parse(response.responseText);

        		swal('No report!', responseObj.errfor.info, 'error');	
        	}
		});

		this.collection.comparedRportCollection.id = this.id;
		this.collection.comparedRportCollection.fetch({
    		success: function (model, response, options) {
    			console.log('success');
        	},
        	error: function (model, response, options) {
				var responseObj = JSON.parse(response.responseText);

        		swal('No report!', responseObj.errfor.info, 'error');	
        	}
		});
*/


	},
	showSpinner: function (){
           this.$el.html('<img src="../img/spinner.gif">');
    },	
    /*
    lolA: function() {
    	var self = this;

		this.collection.singleReportCollection.each(function(submodel) {
			var subView;

			console.log(submodel);
			subView = new app.IozoneItemView ({
				model: submodel
			});

			subView.parentView = self;
			subView.render();	
		}, this);

		return this;
    },
    lolB: function() {
    	var self = this;

		this.collection.comparedRportCollection.each(function(submodel) {
			var subView;

			console.log(submodel);
			subView = new app.IozoneItemViewTest ({
				model: submodel
			});

			subView.parentView = self;
			subView.render();	
		}, this);

		return this;	
    },
    */
	render: function() {
		console.log('======Render times!!!==========');
		var self = this;
		//var self = this;
		this.$el.empty();
		//this.$el.html('<img src="../img/spinner.gif">');
		this.$el.html(this.template());

		console.log('view id...');
		console.log(this.id);

		if (this.id !== null) {
			//this.$el.find()
			var utilityView;

			utilityView = new app.IozoneUtilityView ({

			});

			utilityView.parentView = self;
			utilityView.render();
		}

		this.collection.singleReportCollection.each(function(submodel) {
			var subView;

			//console.log(submodel);
			subView = new app.IozoneItemView ({
				model: submodel
			});

			subView.parentView = self;
			subView.render();	
		}, this);

		this.collection.comparedRportCollection.each(function(submodel) {
			var subView;

			//console.log(submodel);
			subView = new app.IozoneItemViewTest ({
				model: submodel
			});

			subView.parentView = self;
			subView.render();	
		}, this);	

		return this;
	},
	remove: function() {
    	this.$el.empty();
    	this.undelegateEvents();

    	return this;
	},
	compare: function () {
		var numberChecked,
			series = [],
			checkedElement,
			i,
			testmodetext,
			testmode,
			self = this,
			findModel,
			testObj;

		console.log('++++++');
		numberChecked = this.$el.find('input[type="checkbox"]:checked').length;
		if (numberChecked < 2) {
			swal('Compare error', 'You need to select at least two reports', 'error');	
			return false;
		}

		checkedElement = this.$el.find('input[type="checkbox"]:checked.compare-checkbox');

		testmodetext = this.collection.singleReportCollection.models[0].get('testmodetext');
		testmode 	 = this.collection.singleReportCollection.models[0].get('testmode');

		//console.log(lol.get('measuredata'));	

		for (i = 0; i < numberChecked; i++) {
			findModel = this.collection.singleReportCollection.findWhere({ 
				'reportID' : checkedElement[i].getAttribute('data-id')
			});

			testObj = {
				name: findModel.get('reportname'),
				data: findModel.get('measuredata')
			};
			//push the measuredata
			series.push(testObj);
		}
		console.log(series);

		swal({   
			title: 'An input!',   
			text: 'Write something interesting:',   
			type: 'input',   
			showCancelButton: true,   
			closeOnConfirm: false,   
			animation: 'slide-from-top',   
			inputPlaceholder: 'Write something'
		}, function(reportname, aaa){   
			if (reportname === false) {
				return false;      
			}
			if (reportname === '') {     
				swal.showInputError('You need to write something!');     

				return false;
			}      
			swal('Nice!', 'You wrote: ' + reportname, 'success');

			console.log(reportname);

			self.testmodel = new app.IozoneComparedReport();
			self.testmodel.save({
				reportname: reportname,
				testmodetext: testmodetext,
				series: series
			}, {
				success: function(model, response, options) {
					console.log('ComaparedData save successfully');


					console.log(self.collection.comparedRportCollection.id);

					self.collection.comparedRportCollection.id = self.id;	
					self.collection.comparedRportCollection.fetch({
			    		success: function (model, response, options) {
			    			console.log('success');
			        	},
			        	error: function (model, response, options) {
							var responseObj = JSON.parse(response.responseText);

			        		swal('No report!', responseObj.errfor.info, 'error');	
			        	}
					});

				}, 
				error: function(model, response, options) {
					console.log('ComaparedData error save');		
				}
			});			
		});


/*
		this.testmodel = new app.IozoneCompareReport();
		this.testmodel.save({
			devicename: 'devicename',
			emmcID: 'emmcID',
			flashID: 'flashID',
			reportname: 'reportname',
			description: 'description',
			testmodetext: 'testmodetext',
			testmode: 'testmode',
			filesize: 'filesize',
			recordsize: 'recordsize'
		}, {		
			success: function(model, response, options) {
				console.log('Successfully save111');
			}, 
			error: function(model, response, options) {
				console.log('Error save222');		
			}
		});
*/
		//1. new model

		//2. push the new model to the collection


		//3. collection REST-post to the backend DB


	}
	
});


app.IozoneInputView = Backbone.View.extend({
	el: '#global-div',
	events: {
		'click .btn-contact-save': 'save'
		//'click .btn-contact-error': 'error_handle'
	},
	template: template('iozone-input-template'),
	initialize: function() {
		//_.bindAll(this, 'render');
		this.model = new app.IozoneInput();
		this.model.bind('change:devices', this.render, this);

		this.model.set('reportname', moment(new Date()));

		this.render();

		this.model.fetch();
	},
	render: function() {
		this.$el.html(this.template(this.model.attributes));

		return this;
	},
	save: function(e) {
		e.preventDefault();
		var emmcID, flashID;

		var self = this,
			devicename = this.$el.find('select[name="device"] option:selected').text(),
			device = this.$el.find('select[name="device"]').val(),
			reportname = this.$el.find('input[name="name"]').val(),
			description = this.$el.find('textarea[name="description"]').val(),
			testmodetext = this.$el.find('select[name="testmode"] option:selected').text(),
			testmode = this.$el.find('select[name="testmode"]').val(),
			filesize = this.$el.find('select[name="filesize"]').val(),
			recordsize = this.$el.find('select[name="recordsize"]').val();

		if (device !== null) {
			emmcID = JSON.parse(device).emmcID;
			flashID = JSON.parse(device).flashID;
		}

		this.$el.find('.btn-contact-save').prop('disabled', true);
		this.$el.find('.btn-contact-save').addClass('disabled').text('Loading...');

		//the save function will trigger the 'change' event immediately
		this.model.save({
			devicename: devicename,
			emmcID: emmcID,
			flashID: flashID,
			reportname: reportname,
			description: description,
			testmodetext: testmodetext,
			testmode: testmode,
			filesize: filesize,
			recordsize: recordsize
		}, {		
			success: function(model, response, options) {
				console.log('Successfully save');

				swal('Performance test OK!', 'You can view the report of performance test', 'success');
				self.model.set('reportname', moment(new Date()));
				self.render();
			}, 
			error: function(model, response, options) {
				var responseObj = JSON.parse(response.responseText);

				console.log('Error save');

				swal('Performance test fail!', responseObj.errfor.info, 'error');

				//alert(responseObj.errfor.info);
				self.model.set('reportname', moment(new Date()));
				self.render();								
			}
		});
	},
	remove: function() {
    	this.$el.empty();
    	this.undelegateEvents();
    	return this;
	}
});

app.IozoneRegister = Backbone.Model.extend({
	url: function() {
		return 'http://10.5.48.1:3000/iozone-register' +
					(this.id === null ? '' : '/' + this.id);
	},
	id: null,
	defaults: {
		firmwareVersion : '',
		icVersion : '',
		factory : '',
		flashID : '',
		plant : '',
		flashCompany : ''
	}
});

app.IozoneRegisterView = Backbone.View.extend({
	el: '#global-div',
	events: {
		'click .btn-register': 'register'
	},
	template: template('iozone-register-template'),
	initialize: function() {
		_.bindAll(this, 'render');

		this.model = new app.IozoneRegister();
		this.render();
	},
	render: function() {
		console.log('render!!!');

		var self = this,
			i;

		var foods =  [
				//Samsung
				['K9G8G08U0C', 'K9GAG08U0F', 'K9GBG08U0M', 'K9GBG08U0A', 'K9GBG08U0A(new)', 
					'K9GBGD8U0B', 'K9GCGY8S0A', 'K9LCG08U0A', 'K9LCG08U0A(new)', 
					'K9AAGD8U0A', 'K9ABGD8U0C', 'K9ACGD8U0A', 'K9GCGD8U0A', 'K9GBG08U0B'],
				//Hynix
				['H27UAG8T2AT', 'H27UBG8T2MY', 'H27UBG8T2AT', 'H27UCG8T2M', 'H27UCG8T2ETRx', 
					'H27UCG8T2ETRBC'],
				//Toshiba
				['TH58NVG5D2FTA', 'TH58NVG6D2FTA', 'TC58NVG6D2JTA00', 'TC58NVG6D2JTA00(new)', 'TC58NVG6D2HTA00', 
					'TC58NVG6DCJTA00', 'TC58NVG6DCJTA00(new)', 'TH58TEG7DCJBA4C', 'TC58NVG6D2GTA00', 'TH58NVG8DCJTA20', 
					'TC58NVC6DDJTA00', 'TH58TEG7DDJBA4C', 'TH58TEG7DDKBA4C', 'TH58TEG7DDKBA4C(new)', 'TH58TEG8DDHTA20', 
					'TH58TEG9DDJBA89', 'TC58TEG6DDLTA00', 'TH58TEG7DDLTA00', 'TH58TEG8DDLTA00', 'TH58TFG8DFKBA4K', 
					'TC58NVG5T2HTA00', 'TC58NVG5T2HTA00(new)', 'TC58NVG7T2JTA00', 'TC58NVG6T2HTA00', 'TC58NVG6T2HTA00(new)',
					'TH58NVG6T2HTA20', 'TH58TEG6T2JBA4C', 'TH58TEG6T2JBA4C(new A)', 'TH58TEG7T2JBA4C(new B)', 'TH58TEG8D2HTA20', 
					'TC58TEG6TCKTA00', 'TH58TFT0DFKBA8J', 'TC58TEG7TDKTA00'],
				//Sandisk
				['SDTNQCAMA008G', 'SDTNQCAMA008G(new)', 'SDTNQCAMA016G', 'SDTNQCAMA016G(new)', 'SDTNQCAMB032G'],
				//Micron
				['MT29F32G08CBACA', 'MT29F256G08CJA', 'MT29F256G08CJABB', 'MT29F128G08CFA1', 'MT29F128G08CFA1(new)', 
					'MT29F128G08CJA', 'MT29F64G08CFA', 'MT29F32G08CBABA', 'MT29F32G08AFA', 'MT29F16G08CBACA', 
					'MT29F32G08CBAAA', 'MT29F128G08CJAAA', 'MT29F64G08CBACA', 'MT29F128G08CBCAB', 'MICRON_M73_1', 
					'MICRON_M73_2', 'MT29F512G08CKCAB', 'MT29F64G080CBCDB'],
				//Intel
				['JS29F16G08AAME1', 'JS29F32G08AAME1', 'JS29F16B08CAME1', 'JS29F16B08CAME1(new)', 'JS29F64G08AAMF1', 
					'JS29F64G08CAMD1', 'JS29F64G08CAMDB']
		];
		
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.find('#datetimepicker').datetimepicker({
            viewMode: 'days',
            format: 'YYYY/MM/DD',
            defaultDate: new Date()
        });


		for (i = 0; i < foods[0].length; i++) {
			this.$el.find('#foods')
					.append($('<option>', { value : foods[0][i] })
      				.text(foods[0][i])); 
		}

		this.$el.find('#foodgroup').on ('change', function () {
			/*
			console.log(this.selectedIndex);
			console.log(this.options[this.selectedIndex].value);
			var groupID = $(this).val();
			console.log(groupID);
			*/

			self.$el.find('#foods').find('option').remove();

			for (i = 0; i < foods[this.selectedIndex].length; i++) {
				self.$el.find('#foods')
					.append($('<option>', { value : foods[this.selectedIndex][i] })
          			.text(foods[this.selectedIndex][i])); 
			}
		});


		return this;
	},
	register: function(e) {
		e.preventDefault();

		var self = this,
			firmwareVersion = this.$el.find('input[name="firmwareVersion"]').val(),
			icVersion = this.$el.find('select[name="icVersion"]').val(),
			factory = this.$el.find('select[name="factory"]').val(),
			flashID = this.$el.find('select[name="flashID"]').val(),
			plant = this.$el.find('select[name="plant"]').val(),
			flashCompany = this.$el.find('select[name="flashCompany"]').val();

		this.$el.find('.btn-register').prop('disabled', true);
		this.$el.find('.btn-register').addClass('disabled').text('Loading...');

		this.model.save({
			firmwareVersion: firmwareVersion,
			icVersion: icVersion,
			factory: factory,
			flashID: flashID,
			plant: plant,
			flashCompany: flashCompany
		}, {
			success: function(model, response, options) {
				console.log('Successfully register');	
				console.log (response.status);
				//Render 2 times

				swal('Register device OK!', 'You can test performance of the device', 'success');
				self.render();
			}, 
			error: function(model, response, options) {
				swal('Register device OK!', 'You can test performance of the device', 'error');
				self.render();
			}
		});
	},
	remove: function() {
    	this.$el.empty();
    	this.undelegateEvents();
    	return this;
	}
});

app.About = Backbone.Model.extend({
	defaults: {
		title: 'About',
		author: 'joyfeel',
		description: 'sudo mount -t ext4 /dev/mmcblk0 /mmc'
	}
});

app.AboutView = Backbone.View.extend({
	el: '#global-div',
	//template: _.template( $('#about-template').html() ),
	template: template('about-template'),
	initialize: function() {
		_.bindAll(this, 'render');

		this.model = new app.About();
		this.model.bind('change', this.render);
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},
	remove: function() {
    	this.$el.empty();
    	this.undelegateEvents();
    	return this;
	}
});

//main
$(document).ready(function() {


	new app.Router();

	$('#datetimepicker').datetimepicker();

	Backbone.history.start();
});