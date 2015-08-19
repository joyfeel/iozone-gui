"use strict";

var moment = require('moment');



var app = app || {};

var template = function(id) {
	return _.template($('#' + id).html());
};

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
		this.view = new app.IozoneResultView();
    },
    _cleanUp: function() {
        if(this.view)
            this.view.remove();
        this.view = null;
    }
});

app.About = Backbone.Model.extend({
	defaults: {
		title: 'About',
		content: 'Hello...!'
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

/*
app.IozoneResult = Backbone.Model.extend({
	url: function() {
		return 'http://localhost:3000/iozone-input'
						+ (this.id === null ? '' : '/' + this.id);
	},
	id: null,
	defaults: {
		name: 'Joy',
		email: 'joybee210@gmail.com',
		message: 'Test',
		filesize: ''
	}
});
*/

app.IozoneInput = Backbone.Model.extend({
	url: function() {
		return 'http://localhost:3000/iozone-input'
					+ (this.id === null ? '' : '/' + this.id);
	},
	id: null,
	defaults: {
		name: '',
		email: 'joybee210@gmail',
		message: 'Test',
		filesize: '',
		data:[]
	}
});

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
		this.d3_test(this.model.get('data'));

		return this;
	},
	d3_test: function(data) {
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

/*
			var w = 500;
			var h = 100;
			var barPadding = 1;
			
			var dataset = data;
			
			//Create SVG element
			
			var svg = d3.select(this.el).html(this.template(this.model.toJSON))
						.append("svg")
						.attr("width", w)
						.attr("height", h);
			svg.selectAll("rect")
			   .data(dataset)
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
			   		return i * (w / dataset.length);
			   })
			   .attr("y", function(d) {
			   		return h - (d * 4);
			   })
			   .attr("width", w / dataset.length - barPadding)
			   .attr("height", function(d) {
			   		return d * 4;
			   })
			   .attr("fill", function(d) {
					return "rgb(0, 0, " + (d * 10) + ")";
			   });
			svg.selectAll("text")
			   .data(dataset)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d;
			   })
			   .attr("text-anchor", "middle")
			   .attr("x", function(d, i) {
			   		return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
			   })
			   .attr("y", function(d) {
			   		return h - (d * 4) + 14;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "white");
*/			   


	},
	remove: function() {
    	this.$el.empty();
    	this.undelegateEvents();
    	return this;
	}
});

app.IozoneInputView = Backbone.View.extend({
	el: '#global-div',
	events: {
		'click .btn-contact-save': 'save'
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

		return this;
	},
	save: function(e) {
		var self = this;
		e.preventDefault();
		
		var name = this.$el.find('input[name="name"]').val();
		var email = this.$el.find('input[name="email"]').val();
		var message = this.$el.find('textarea[name="message"]').val();
		var filesize = this.$el.find('select[name="filesize"]').val();
		
		this.$el.find('button[type="submit"]').hide();	
		this.model.save({
			name: name,
			email: email,
			message: message,
			filesize: filesize
		}, {
			success: function(model, response, options) {
				console.log("Successfully save");	
				self.model.set('name', moment(new Date()));
				//Render 2 times
				self.render();
			}, 
			error: function(model, response, options) {
				console.log(response);
				console.log("Error save");
			}
		});
	},
	remove: function() {
		//this.model.destroy();
    	this.$el.empty();
    	this.undelegateEvents();
    	return this;
	}
});

/*
var w = 440,
    h = 200;

var DataPoint = Backbone.Model.extend({
    initialize: function(x) {
        this.set({
            x: x
        });
    },
    type: "point",
    randomize: function() {
    	this.set({
        	x: Math.round(Math.random() * 10)
    	});
  	}
});

var DataSeries = Backbone.Collection.extend({
    model: DataPoint,

    fetch: function() {
        this.reset();
        this.add([
            new DataPoint(11),
            new DataPoint(12),
            new DataPoint(15),
            new DataPoint(18)
            ]);
    },
    randomize: function() {
        this.each(function(m) {
            m.randomize();
        });
    }
});

var BarGraph = Backbone.View.extend({
    el: "#global-div",
    template: template('iozone-result-template'),
    initialize: function() {
        _.bindAll(this, "render", "frame");
        this.collection.bind("reset", this.frame);
        this.collection.bind("change", this.render);

        this.chart = d3.selectAll($(this.el).html(this.template())).append("svg")
        			   .attr("class", "chart").attr("width", w).attr("height", h)
        			   .append("g").attr("transform", "translate(10,15)");

        this.collection.fetch();
    },
    render: function() {
        var data = this.collection.models;
        var x = d3.scale.linear().domain([0, d3.max(data, function(d) {
            return d.get("x");
        })]).range([0, w - 10]);

        var y = d3.scale.ordinal().domain([0, 1, 2, 3]).rangeBands([0, h - 20]);

        var self = this;
        var rect = this.chart.selectAll("rect").data(data, function(d, i) {
            return i;
        });

        rect.enter().insert("rect", "text").attr("y", function(d) {
            return y(d.get("x"));
        }).attr("width", function(d) {
            return x(d.get("x"));
        }).attr("height", y.rangeBand());

        rect.transition().duration(1000).attr("width", function(d) {
            return x(d.get("x"));
        }).attr("height", y.rangeBand());

        rect.exit().remove();
        
        var text = this.chart.selectAll("text").data(data, function(d, i) {
            return i;
        });

       text.enter().append("text")
        .attr("x", function(d) {
            return x(d.get("x"));
        })
        .attr("y", function(d,i) { return y(i) + y.rangeBand() / 2; })
        .attr("dx", -3) // padding-right
        .attr("dy", ".35em") // vertical-align: middle
        .attr("text-anchor", "end") // text-align: right
           .text(function(d) { return d.get("x");});
        
        text
        .transition()
        .duration(1100)
        .attr("x", function(d) {
            return x(d.get("x"));
        })
         .text(function(d) { return d.get("x");});
  
    },
    frame: function() {
        this.chart.append("line").attr("y1", 0).attr("y2", h - 10).style("stroke", "#000");
        this.chart.append("line").attr("x1", 0).attr("x2", w).attr("y1", h - 10).attr("y2", h - 10).style("stroke", "#000");
    }
});
*/

//main
$(document).ready(function() {
	var route = new app.Router();

	Backbone.history.start();
});