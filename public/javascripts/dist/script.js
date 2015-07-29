(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var appleData = [
	{
		name: 'fuji',
		url: 'images/fuji.jpg'
	}
	,
	{
		name: 'gala',
		url: 'images/gala.jpg'
	}
	
];

var Apples = Backbone.Collection.extend({
});


var router = Backbone.Router.extend({
	routes: {
		'' : 'home',
		'apples/:appleName': 'loadApple'
	},
	initialize: function() {
		var apples = new Apples();
		apples.reset(appleData);
		this.homeView = new homeView({collection: apples});
		this.appleView = new appleView({collection: apples});
	},
	home: function() {
		this.homeView.render();
	},
	loadApple: function(appleName) {
		//this.appleView.render(appleName);
		this.appleView.loadApple(appleName);
	}
});

var homeView = Backbone.View.extend({
	el: 'body',
	listEl: '.apples-list',
	cartEl: '.cart-box',
	template: _.template('Apple data: \
				<ul class="apples-list">\
				</ul>\
				<div class="cart-box"></div>'),
	initialize: function() {
		this.$el.html(this.template);
		this.collection.on('addToCart', this.showCart, this);
	},
	showCart: function(appleModel) {
		$(this.cartEl).append(appleModel.attributes.name+'<br/>');
	},
	render: function () {
		var view = this;
		//so we can use view inside of closure
		this.collection.each(function(apple){
			var appleSubView = new appleItemView({model:apple});
			// creates subview with model apple
			appleSubView.render();
			// compiles template and single apple data
			$(view.listEl).append(appleSubView.$el);
			//append jQuery object from single
			//apple to apples-list DOM element
		});
	}
});

var appleView = Backbone.View.extend({
	templateSpinner: '<img src="images/spinner.gif" width="30"/>',
	template: _.template(
				'<figure>' 
				+ '<img src="<%= attributes.url %>" />' 
				+ '<figcation> <%= attributes.name %> </figcation>' 
				+ '</figure>'),
	initialize: function() {
		this.model = new (Backbone.Model.extend({}));
		this.model.on('change', this.render, this);
		this.on('spinner', this.showSpinner, this);
	},
	showSpinner: function() {
		$('body').html(this.templateSpinner);
	},
	loadApple: function(appleName) {
		this.trigger('spinner');
		var self = this;

		setTimeout(function() {
			self.model.set(self.collection.findWhere({name : appleName}).attributes);
		}, 2000);

	},
	render: function(appleName) {
		//where that returns the array of model, 
		//var appleModel = this.collection.findWhere({name: appleName});
		//var appleHtml  = this.template(appleModel);
		//$('body').html(appleHtml);
		var appleHtml = this.template(this.model);
		$('body').html(appleHtml);

	}
});

var appleItemView = Backbone.View.extend({
	tagName: 'li',
	template: _.template(''
				+'<a href="#apples/<%=name%>" target="_blank">'
				+'<%=name%>'
				+'</a>&nbsp;<a class="add-to-cart" href="#">buy</a>'),
	events: {
		'click .add-to-cart' : 'addToCart'
	},
	render: function() {
		this.$el.html(this.template(this.model.attributes));

	},
	addToCart: function() {
		this.model.collection.trigger('addToCart', this.model);
	}
}); 


var app;

$(document).ready(function() {
	app = new router;
	Backbone.history.start();
})
},{}]},{},[1])