(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

'use strict';

var About = Backbone.Model.extend({
	defaults: {
		title: 'About2',
  		subtitle: 'About subtitle2',
  		description: 'About practice2'
	}
});

var Contact = Backbone.Model.extend({
	defaults: {
		title: 'Contact',
  		//subtitle: 'About subtitle',
  		description: 'Contact practice'
	}
});

var AboutView = Backbone.View.extend({
	el: '#about-div',
	template: _.template('<h1><%= description %></h1>'),
	initialize: function() {
		this.model.on('change', this.render, this);
		this.render();
	},
	render: function() {
		var compiled = this.template(this.model.toJSON());
		this.$el.html(compiled);

		return this;
	}
});

var ContactView = Backbone.View.extend({
	el: '#contact-div',
	template: _.template($('#contact-template').text()),
	initialize: function() {
		this.model.on('change', this.render, this);
		this.render();
	},
	render: function() {
		var compiled = this.template(this.model.toJSON());
		this.$el.html(compiled);

		return this;
	}
});


var Workspace = Backbone.Router.extend({
	routes: {
		'contact': 'contact',
		'about': 'about'
	},
	about: function() {
		var about = new About();
		this.view = new AboutView({
			model: about
		});		

	},
	contact: function() {
		var contact = new Contact();
		this.view = new ContactView({
			model: contact
		});
	},
	get_apple: function() {
		console.log("Here is your apple!");
	},
	get_router: function() {
		console.log("My Routers!");
	}

});


//main
$(document).ready(function() {
	var about = new About();
	var aboutView = new AboutView({
		model: about
	});	
	//var work = new Workspace();
	//Backbone.history.start();
});


},{}]},{},[1])