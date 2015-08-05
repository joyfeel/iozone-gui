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
