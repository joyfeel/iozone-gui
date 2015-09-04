'use strict';

var moments = require('moment');

var app = app || {};

var template = function(id) {
	return _.template($('#' + id).html());
};

app.IozoneInput = Backbone.Model.extend({
	url: function() {
		return 'http://localhost:3000/iozone-input' +
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

app.IozoneReport = Backbone.Model.extend({
	urlRoot: function() {
		return 'http://localhost:3000/iozone-report' +
					(this.id === null ? '' : '/' + this.id);
	},
	id: null,
	idAttribute: '',
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
	model: app.IozoneReport,
	url: function() {
		return 'http://localhost:3000/iozone-report' +
					(this.id === null ? '' : '/' + this.id);		
	},
	id: null
});

app.Router = Backbone.Router.extend({
	routes: {
		'about': 'about',
		'iozone-register': 'iozoneRegister',
		'iozone-input': 'iozoneInput',
		'iozone-result': 'iozoneResult'
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
			collection: app.IozoneReportCollection
		});
    },
    _cleanUp: function() {
        if(this.view) {
            this.view.remove();
        }
        this.view = null;
    }
});

app.IozoneItemView = Backbone.View.extend({
	events: {
		'click .btn-delete-report': 'delete'
	},
	template: template('iozone-result-sub-template'),
	initialize: function () {
		//this.model.on('remove', this.render);
		//this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		this.d3LineChart(this.model.get('measuredata'));

		this.parentView.$el.find('.chart-row').append( this.$el );

		return this;
	},
	d3LineChart: function(data) {
		var w = 500,
			h = 300,
		    padding = 30;

		var xScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) {
							     return d[0];
							 })])
							 .range([padding, w - padding*2]);

		var yScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) {
							     return d[1];
							 })])
							 .range([h - padding, padding]);

		var rScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) {
							     return d[1];
							 })])
							 .range([2, 5]);

		var xAxis = d3.svg.axis()
						  .scale(xScale)
						  .orient('bottom')
						  .ticks(5);

		var yAxis = d3.svg.axis()
						  .scale(yScale)
						  .orient('left')
						  .ticks(5);

		var svg = d3.select(this.el)
					.select('.myd3-line-chart')
					.append('svg')
					.attr({
						width: w,
						height: h
					});

			svg.selectAll('circle')
			   .data(data)
			   .enter()
			   .append('circle')
			   .attr({
			       cx: function(d) {	
			           return xScale(d[0]);	
			       }, 
			       cy: function(d) {	
			           return yScale(d[1]);	
			       }, 
			       r: function(d) {			
			           return rScale(d[1]);
			       }
			   });

			svg.selectAll('text')
			   .data(data)
			   .enter()
			   .append('text')
			   .text(function(d) {
			       return d[0] + ',' + d[1];	
			   })
			   .attr({
			       x: function(d) {
			           return xScale(d[0]);
			       },
			       y: function(d) {
			           return yScale(d[1]);
			       },
			       'font-family': 'sans-serif',
			       'font-size': '12px',
			       'fill': 'green'
			   });

		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(0,  '+(h - padding)+')')
			.call(xAxis);

		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate('+padding+', 0)')
			.call(yAxis);
	},
	delete: function (e) {
        // now that we need to know, we can just check that attribute

        e.preventDefault();
        var id = $(e.target).data('id');
        //console.log('@@@@@@@@@@@id!');
        this.model.id = id;
        this.model.idAttribute = id;
        console.log(this.model);
        this.model.destroy({
    		success: function (model, response, options) {
            	//swal('Meow!', 'You can view the report of performance test', 'success');
            	//self.render();
            	console.log('YYYYYYY');
        	},
        	error: function (model, response, options) {
				//var responseObj = JSON.parse(response.responseText);
				console.log('NNNNNNN');
        		//swal('No report!', responseObj.errfor.info, 'error');	
        	}
        });
        
    }
});
/*
app.IozoneInputView = Backbone.View.extend({
	el: '#global-div',
	events: {
		'click .btn-contact-save': 'save',
		'click .btn-contact-error': 'error_handle'
	},
	template: template('iozone-input-template'),
	initialize: function() {
		_.bindAll(this, 'render');

		this.model = new app.IozoneInput();
		//this.model.bind('remove', this.render, this);	
		//this.listenTo(this.model, 'change', this.render, this);

		//Render 1 times
		this.model.set('name', moments(new Date()));
		this.render();
	},
	render: function() {
		console.log("render!!!");
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.find('.btn-contact-error').hide();

		return this;
	},
	save: function(e) {
		var self = this,
			reportname = this.$el.find('input[name="name"]').val(),
		    email = this.$el.find('input[name="email"]').val(),
			description = this.$el.find('textarea[name="description"]').val(),
			filesize = this.$el.find('select[name="filesize"]').val(),
			testmode = this.$el.find('select[name="testmode"]').val();

 		e.preventDefault();
        e.stopPropagation();

		//this.$el.off('click', '.btn-contact-save');
		//this.events["click .btn-contact-save"] = undefined;
        //$(this.el).undelegate('.btn-contact-save', 'click');

		console.log(filesize.val());
		console.log(filesize.text());

		console.log(testmode.val());
		console.log(testmode.text());
	
		//this.$el.find('button[type="submit"]').button('loading');

		//!!!! this.$el.find('button[type="submit"]').prop('disabled', true);
		this.$el.find('.btn-contact-save').prop('disabled', true);
		this.$el.find('.btn-contact-save').addClass('disabled').text('Loading...');

		this.model.save({
			reportname: reportname,
			email: email,
			description: description,
			filesize: filesize,
			testmode: testmode
		}, {
			success: function(model, response, options) {
				console.log("Successfully save");	
				self.model.set('name', moments(new Date()));
				//Render 2 times
				self.render();
			}, 
			error: function(model, response, options) {
				self.$el.find('.btn-contact-error').show();
				self.$el.find('.btn-contact-save').hide();
				console.log(response);
				console.log("Error save");
			}
		});
	},
	error_handle: function (e) {
		e.preventDefault();
        e.stopPropagation();
		alert('Need to mount the device');
		//this.$el.find('.btn-contact-error').hide();
		this.model.set('name', moments(new Date()));
		this.render();
	},
	remove: function() {
		//this.model.destroy();
    	this.$el.empty();
    	this.undelegateEvents();
    	return this;
	}
});
*/

app.IozoneResultView = Backbone.View.extend({
	el: '#global-div',
	events: {
		'click .checkbox': 'compare'
		//'click .btn-delete-report': 'delete'
	},
	template: template('iozone-result-template'),
	initialize: function() {
		_.bindAll(this, 'render');
		this.collection = new app.IozoneReportCollection();

		this.collection.on('change', this.render);
		this.collection.on('add', this.render);
		this.collection.on('remove', this.render);

		this.render();
		this.collection.fetch({
    		success: function (model, response, options) {
            	//swal('Meow!', 'You can view the report of performance test', 'success');
            	//self.render();
        	},
        	error: function (model, response, options) {
				var responseObj = JSON.parse(response.responseText);

        		swal('No report!', responseObj.errfor.info, 'error');	
        	}
		});
	},
	render: function() {
		var self = this;
		this.$el.empty();
		this.$el.html(this.template());

		this.collection.each(function(submodel) {
			var subView = new app.IozoneItemView ({
				model: submodel
			});

			subView.parentView = self;
			subView.render();
		});

		return this;
	},
	remove: function() {
    	this.$el.empty();
    	this.undelegateEvents();

    	return this;
	},
	compare: function(e) {
		//alert($(e.currentTarget).is(':checked') ? 'checked' : 'unchecked');
		//this.showCompletedEnquiries = e.currentTarget.checked;
		console.log(e.currentTarget.checked);

		return true;
	}
});


/*
app.IozoneResultView = Backbone.View.extend({
	el: '#global-div',
	template: template('iozone-result-template'),
	initialize: function() {
		//_.bindAll(this, 'render');

		this.model = new app.IozoneInput();
		this.listenTo(this.model, 'change', this.render, this);
		//this.model.bind('change', this.render);	
		this.render();
		this.model.fetch();  
	},
	render: function() {
		this.d3_line_chart(this.model.get('data'));

		return this;
	},
	d3_line_chart: function(data) {
		var w = 500;
		var h = 300;
		var padding = 30;

		var xScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) {
							     return d[0];
							 })])
							 .range([padding, w - padding*2]);

		var yScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) {
							     return d[1];
							 })])
							 .range([h - padding, padding]);

		var rScale = d3.scale.linear()
							 .domain([0, d3.max(data, function(d) {
							     return d[1];
							 })])
							 .range([2, 5]);


		var xAxis = d3.svg.axis()
						  .scale(xScale)
						  .orient('bottom')
						  .ticks(5);

		var yAxis = d3.svg.axis()
						  .scale(yScale)
						  .orient('left')
						  .ticks(5);
//self.$el.find('.btn-contact-error').show();
		var svg = d3.select(this.el).html(this.template(this.model.toJSON))
					.append('svg')
					.attr({
						width: w,
						height: h
					});

			svg.selectAll('circle')
			   .data(data)
			   .enter()
			   .append('circle')
			   .attr({
			       cx: function(d) {	
			           return xScale(d[0]);	
			       }, 
			       cy: function(d) {	
			           return yScale(d[1]);	
			       }, 
			       r: function(d) {			
			           //return Math.sqrt(h - d[1]);
			           //return Math.sqrt((h - d[1])/Math.PI);
			           return rScale(d[1]);
			       }
			   });

			svg.selectAll('text')
			   .data(data)
			   .enter()
			   .append('text')
			   .text(function(d) {
			       return d[0] + ',' + d[1];	
			   })
			   .attr({
			       x: function(d) {
			           return xScale(d[0]);
			       },
			       y: function(d) {
			           return yScale(d[1]);
			       },
			       'font-family': 'sans-serif',
			       'font-size': '12px',
			       'fill': 'green'
			   });


		//svg.append('g').call(xAxis);
		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(0,  '+(h - padding)+')')
			.call(xAxis);

		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate('+padding+', 0)')
			.call(yAxis);

	},
	remove: function() {
    	this.$el.empty();
    	this.undelegateEvents();
    	return this;
	}
});
*/

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

		this.model.set('reportname', moments(new Date()));

		this.render();

		this.model.fetch();
	},
	render: function() {
		//this.$el.html(this.template(this.model.attributes));

		this.$el.html(this.template(this.model.attributes));
		//this.$el.find('.btn-contact-error').hide();


		//this.$el.find('.btn-contact-save').prop('disabled', true);
		//this.$el.find('.btn-contact-save').addClass('disabled').text('Loading...');
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
				self.model.set('reportname', moments(new Date()));
				self.render();
			}, 
			error: function(model, response, options) {
				var responseObj = JSON.parse(response.responseText);

				console.log('Error save');

				swal('Performance test fail!', responseObj.errfor.info, 'error');

				//alert(responseObj.errfor.info);
				self.model.set('reportname', moments(new Date()));
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
		return 'http://localhost:3000/iozone-register' +
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
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},
	register: function(e) {
		e.preventDefault();

		var self = this,
			firmwareVersion = this.$el.find('select[name="firmwareVersion"]').val(),
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

	Backbone.history.start();
});