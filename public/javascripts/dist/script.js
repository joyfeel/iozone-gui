(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
	about: function() {
		new app.AboutView();
	},
	iozone_input: function() {
		new app.IozoneInputView();
	},
	iozone_result: function() {
		//var contact = new app.ContactView();
		new app.IozoneResultView();

/*
		var dataSeries = new DataSeries();
    	new BarGraph({
        	collection: dataSeries
    	}).render();
*/
    	/*
    	setInterval(function() {
	        dataSeries.randomize();
	    	}, 2000);
		*/
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
		name: 'Joy',
		email: 'joybee210@gmail.com',
		message: 'Test',
		filesize: '',
		data:[]
	}
});

app.IozoneResultView = Backbone.View.extend({
	el: '#global-div',
	template: template('iozone-result-template'),
	initialize: function() {
		_.bindAll(this, 'render');

		this.model = new app.IozoneInput();
		this.model.bind('change', this.render);	
		this.render();
		this.model.fetch();
	},
	render: function() {
		console.log(this.model.get('message'));
		console.log(this.model.get('data'));

		var test = d3.select(this.el)
		  .html(this.template(this.model.toJSON()))
		  .selectAll('div')
		  .data(this.model.get('data'))
		  .enter()
		  .append('div')
		  .text(String);

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
		//this.model.bind('change', this.render);	
		this.render();
	},
	render: function() {

		this.$el.html(this.template(this.model.toJSON()));

		//console.log(this.$el.find('select[name="filesize"]').val());

		return this;
	},
	save: function(e) {
		e.preventDefault();
		
		var name = this.$el.find('input[name="name"]').val();
		var email = this.$el.find('input[name="email"]').val();
		var message = this.$el.find('textarea[name="message"]').val();
		var filesize = this.$el.find('select[name="filesize"]').val();

		this.model.save({
			name: name,
			email: email,
			message: message,
			filesize: filesize
		}, {
			success: function(model, response, options) {
				if (response == 200) {
					console.log("Successfully save");
				}
			}, 
			error: function(model, response, options) {
				console.log(response);
				console.log("Error save");
			}
		});
	}
});

/*
app.User = Backbone.Model.extend({
	defaults: {
		name: 'joy',
		email: 'dasd@adsdsa'

	}
});

app.SignupView = Backbone.View.extend({
	el: '#global-div',
	template: _.template( $('#signup-template').html() ),

	events: {
		'change input': 'inputChange'
	},
	initialize: function() {
		_.bindAll(this, 'render', 'inputChange');

		this.model = new app.User();
		this.model.bind("change", this.render);
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		//console.log($('#signup-template').text());
		return this;
	},
	inputChange: function(e) {
		var $input = $(e.target);

		var inputName = $input.attr('name');

		this.model.set(inputName, $input.val());
	}

});
*/

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

//main
$(document).ready(function() {
	//var sign = new app.SignupView();
	var route = new app.Router();

	Backbone.history.start();
});
},{}]},{},[1])