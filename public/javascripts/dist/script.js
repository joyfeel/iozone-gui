(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

'use strict';

var Chatroom = Backbone.Model.extend({
	defaults: {
		//title: 'Chatroom Title',
  		//subtitle: 'Chatroom Subtitle',
  		//data: {
		description: 'Chatroom description'

  		//}
  		
	}
});


var ChatroomView = Backbone.View.extend({
	el: '#chatroom-div',
	//template: _.template($('#chatroom-template').html()),
	template: _.template('<h1><%= description %></h1>'),
	initialize: function() {
		this.model.on('change', this.render, this);
		this.render();
	},
	render: function() {
		var compiled = this.template(this.model.toJSON());
		//var compiled = this.template(this.model.get('description'));
		this.$el.html(compiled);

		return this;
	}
});


var Workspace = Backbone.Router.extend({
	routes: {
		'chatrooms': 'chatroom'
	},
	chatroom: function() {
		var chatroom = new Chatroom();
		this.view = new ChatroomView({
			model: chatroom
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
	var chatroom = new Chatroom();
	var chatroomView = new ChatroomView({
		model: chatroom
	});	
	//var work = new Workspace();
	//Backbone.history.start();
});


},{}]},{},[1])