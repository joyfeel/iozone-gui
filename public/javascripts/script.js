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