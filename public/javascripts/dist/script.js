(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var About = Backbone.Model.extend({
	defaults: {
		title: 'About',
  		//subtitle: 'About subtitle',
  		description: 'About practice'
	}
});

var AboutView = Backbone.View.extend({
	el: '#about-div',
	template: _.template($('#about-template').text()),
	initialize: function() {
		this.model.on('change', this.render, this);
		this.render();
	},
	render: function() {
		var compiled = this.template(this.model.toJSON());
		this.$el.html(compiled);

		return this;
	}
})

var User = Backbone.Model.extend({});

var UserView = Backbone.View.extend({
	el: '#user-card',
	//template: _.template( $('#user-template').text()),
	//template: _.template( '<p><%= displayName %></p>'),
	template: _.template( $('#user-template').text()),
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
		"settings": 'settings',
		"apple": 'get_apple',
		"my_router": 'get_router',
		'about': 'about_foo'
	},
	settings: function() {
		console.log("My setting QQ");
	},
	get_apple: function() {
		console.log("Here is your apple!");
	},
	get_router: function() {
		console.log("My Router!");
	},
	about_foo: function() {
		var about = new About();
		var aboutView = new AboutView({
			model: about
		})		
	}
});


//main
$(document).ready(function() {
	//Collection: give the instance of model to collection
	var user = new User({
		displayName: '???q'
	});
	
	var userView = new UserView({
		model: user
	});



	var work = new Workspace();
	Backbone.history.start();
});


},{}]},{},[1])