(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
var Rectangle = Backbone.Model.extend({

});


var RectangleView = Backbone.View.extend({
	tagName: 'div',
	className: 'rectangle',

	render: function() {
		console.log("WWW");
		this.setDimensions();
	},
	setDimensions: function() {
		this.$el.css({
			width: this.model.get('width') + 'px',
			height: this.model.get('height') + 'px'
		});
	},
	setPosition: function() {
		var position = this.model.get('position');
	 	this.$el.css({
			left: position.x,
			top: position.y
		});
	}
}); 

	var myRectangle = new Rectangle({
		width: 100,
		height: 60,
		position: {
			x: 300,
			y: 150 
		}
	});
	
	var myView = new RectangleView({model: myRectangle});


$(document).ready(function() {
	//app = new router;
	//Backbone.history.start();
	$('div#canvas').append(myView.render().el);
})
	 
	//


})();

//$(document).ready(function() {
	
	//app = new router;
	//Backbone.history.start();
//})
},{}]},{},[1])