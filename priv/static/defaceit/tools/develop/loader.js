Defaceit.Loader = function(models){
	this.overlay();
	this.models = models;
	_.each(this.models, function(model){
			model.once('sync', this.do_next, this)
	}, this);
	this.do_next();
};

Defaceit.Loader.prototype = _.extend({
	overlay: function(){
		jQuery('.dtWindow').remove();
		Defaceit.Window.Manager.create('Simple', {
            content: "&nbsp;",
            //title: "создать страницу",
            geometry: ['center','show']
            });
		jQuery('.dtWindowContent').html("Loading...");
	},

	do_next: function(){
		var nextModel = this.models.pop();
		if(nextModel){
			nextModel.fetch();
			return;
		}

	jQuery('.dtWindow').remove();
	this.trigger('done');
}


}, Backbone.Events);