(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function($) {

	var User = Backbone.Model.extend({});

	var UserView = Backbone.View.extend({
		el: '#user-card',
		template: _.template( $('#user-template').text()),
		initialize: function() {
			this.model.on('change', this.render, this);
			this.render();
		},
		render: function() {
			var compiled = this.template(this.model.toJSON());

			this.$el.html(compiled);
			console.log("@@");
			return this;
		}
	});

	//main
	$(document).ready(function() {
		//Collection: give the instance of model to collection
		
		var user = new User({
			displayName: 'B',
			userName: 'B',
			bio: 'B'
		});
		
		var userView = new UserView({
			model: user
		});
	});
})(jQuery);

},{}]},{},[1])