
'use strict';

var app = app || {};

app.Router = Backbone.Router.extend({
	routes: {
		'about': 'about',
		'contact': 'contact'
	},
	about: function() {
		var about = new app.AboutView();
	},
	contact: function() {
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
	template: _.template( $('#about-template').html() ),
	initialize: function() {
		//_.bindAll(this, 'inputChange');

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
	defaults: {
		name: 'Joy',
		email: 'joybee210@gmail.com'
	}
});

app.ContactView = Backbone.View.extend({
	el: '#global-div',
	template: _.template( $('#contact-template').html() ),
	initialize: function() {
		//_.bindAll(this, 'inputChange');

		this.model = new app.Contact();
		this.model.bind("change", this.render);
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
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
		_.bindAll(this, 'inputChange');

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