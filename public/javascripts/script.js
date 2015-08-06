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

