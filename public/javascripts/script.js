"use strict";

var moment = require('moment');

var app = app || {};

var template = function(id) {
	return _.template($('#' + id).html());
};

app.IozoneInput = Backbone.Model.extend({
	url: function() {
		return 'http://localhost:3000/iozone-input'
					+ (this.id === null ? '' : '/' + this.id);
	},
	id: null,
	defaults: {
		filename: '',
		description: 'Test',
		filesize: '',
		data:    [],
		testmode: ''
	}
});

app.IozoneInputCollection = Backbone.Collection.extend({
	model: app.IozoneInput,
	url: function() {
		return 'http://localhost:3000/iozone-input'
					+ (this.id === null ? '' : '/' + this.id);		
	},
	id: null
});

app.Router = Backbone.Router.extend({
	routes: {
		'about': 'about',
		'iozone-input': 'iozone_input',
		'iozone-result': 'iozone_result'
	},
	initialize: function() {
        this.view = null;
    },
	about: function() {
		this._cleanUp();
		this.view = new app.AboutView();
	},
	iozone_input: function() {
		this._cleanUp();
		this.view = new app.IozoneInputView();
	},
	iozone_result: function() {
		this._cleanUp();
		this.view = new app.IozoneResultView({
			collection: app.IozoneInputCollection
		});
    },
    _cleanUp: function() {
        if(this.view)
            this.view.remove();
        this.view = null;
    }
});

app.IozoneItemView = Backbone.View.extend({
	template: template('iozone-result-sub-template'),
	render: function() {
		

		this.$el.html(this.template(this.model.toJSON()));
		//console.log(this.$el);
		this.d3_line_chart(this.model.get('data'));

		//this.$el.html(this.model.get('filename'));
		this.parentView.$el.find('.row').append( this.$el );

		return this;
	},
	d3_line_chart: function(data) {
		var w = 350,
			h = 200,
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

		var svg = d3.select(this.el).select('.myd3-line-chart')
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

	}
});

app.IozoneResultView = Backbone.View.extend({
	el: '#global-div',
	template: template('iozone-result-template'),
	initialize: function() {
		_.bindAll(this, 'render');

		//this.model = new app.IozoneInput();

		this.collection = new app.IozoneInputCollection();

		this.collection.on('change', this.render);
		this.collection.on('add', this.render);
		this.collection.on('remove', this.render);

		//this.collection.bind('sync', this.render, this);
		//this.listenTo(this.model, 'change', this.render, this);
		//this.model.bind('change', this.render);	
		this.render();
		//this.model.fetch();
		this.collection.fetch();
	},
	render: function() {
		//this.d3_line_chart(this.model.get('data'));
		this.$el.empty();

		this.$el.html(this.template());

		var self = this;
		
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
		this.model.set('name', moment(new Date()));
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
			filename = this.$el.find('input[name="name"]').val(),
		    email = this.$el.find('input[name="email"]').val(),
			description = this.$el.find('textarea[name="description"]').val(),
			filesize = this.$el.find('select[name="filesize"]').val(),
			testmode = this.$el.find('select[name="testmode"]').val();

 		e.preventDefault();
        e.stopPropagation();

		//this.$el.off('click', '.btn-contact-save');
		//this.events["click .btn-contact-save"] = undefined;
        //$(this.el).undelegate('.btn-contact-save', 'click');
/*
		console.log(filesize.val());
		console.log(filesize.text());

		console.log(testmode.val());
		console.log(testmode.text());
*/	
		//this.$el.find('button[type="submit"]').button('loading');

		//!!!! this.$el.find('button[type="submit"]').prop('disabled', true);
		this.$el.find('.btn-contact-save').prop('disabled', true);
		this.$el.find('.btn-contact-save').addClass('disabled').text('Loading...');

		this.model.save({
			filename: filename,
			email: email,
			description: description,
			filesize: filesize,
			testmode: testmode
		}, {
			success: function(model, response, options) {
				console.log("Successfully save");	
				self.model.set('name', moment(new Date()));
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
		this.model.set('name', moment(new Date()));
		this.render();
	},
	remove: function() {
		//this.model.destroy();
    	this.$el.empty();
    	this.undelegateEvents();
    	return this;
	}
});


app.About = Backbone.Model.extend({
	defaults: {
		title: 'About',
		author: 'joyfeel',
		content: 'I\'m god'
	}
});

app.AboutView = Backbone.View.extend({
	el: '#global-div',
	//template: _.template( $('#about-template').html() ),
	template: template('about-template'),
	initialize: function() {
		_.bindAll(this, 'render');

		this.model = new app.About();
		this.model.bind("change", this.render);
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
	var route = new app.Router();

	Backbone.history.start();
});