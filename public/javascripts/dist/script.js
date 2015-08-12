(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

//'use strict';

var app = app || {};


var template = function(id) {
	return _.template($('#' + id).html());
};

app.Router = Backbone.Router.extend({
	routes: {
		'about': 'about',
		'iozone-input': 'iozone_input'
	},
	about: function() {
		var about = new app.AboutView();
	},
	iozone_input: function() {
		var contact = new app.ContactView();
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


app.Contact = Backbone.Model.extend({
	url: function() {
		return 'http://localhost:3000/iozone-input'
						+ (this.id === null ? '' : '/' + this.id);
	},
	id: null,
	defaults: {
		name: 'Joy',
		email: 'joybee210@gmail.com',
		message: 'QQ',
		filesize: ''
	}
});

app.ContactView = Backbone.View.extend({
	el: '#global-div',
	events: {
		'click .btn-contact-save': 'save'
	},
	template: template('iozone-input-template'),
	initialize: function() {
		_.bindAll(this, 'render');

		this.model = new app.Contact();
		this.model.bind('change', this.render);	
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		console.log(this.$el.find('select[name="filesize"]').val());

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
			}
			, 
			error: function(model, response, options) {
				console.log(response);
				console.log("Error save");
			}
			
		});

	}
});

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

//main
$(document).ready(function() {
	var sign = new app.SignupView();

	var route = new app.Router();
	Backbone.history.start();
});
},{}]},{},[1])