
function isDefaceit(){
	return 'Defaceit mode available';
}

Defaceit.Model = Backbone.Model.extend({
	
	urlRoot: "http://eservices.defaceit.ru/variable/pack_json",
	parse: function(resp, options) {
		var result = resp;
		if(resp.pack) {
			  result = {};

			  _.each(resp.pack, function(o){
			  		var shortName = o.variable_name.split(".")[0];//replace("."+this.id, "");
			  		//console.debug(this.get('id'));
			  		console.debug(shortName);
			  		result[shortName] = decodeURIComponent(o.data.message_text);
			  }, this);
		      //console.debug(resp);
		 }
      return result;
    }
});

Defaceit.Template = Defaceit.Model.extend({
});


Defaceit.Collection = Backbone.Collection.extend({
	urlRoot: "http://eservices.defaceit.ru/variable/pack_json",
	
	parse: function(resp) {

		var struct = {}, result = [], namespace = resp.variable_name_space;
		if(resp.pack) {

			  _.each(resp.pack, function(o){

			  		var parts = o.variable_name.split("."),
			  			shortName = parts[0],
			  			partId = parts[1];//parseInt(parts[1]);

			  		//if (isNaN(partId)) {
			  		//	return;
			  		//}

			  		if(!struct[partId]){
			  			struct[partId] = {id: partId+'.'+namespace};
			  		}

			  		struct[partId][shortName] = decodeURIComponent(o.data.message_text);
			  }, this);
		      

		      _.each(struct, function(o){
		      		result.push(o);
		      });
		 }
			return result;
	}

});


Defaceit.View = Backbone.View.extend({
	templateName: "",
	target: "body",

	toString: function() {
		return "defaceit_view";
	}
});

Defaceit.Layout = {};

Defaceit.Layout.HorizontalPanel = Defaceit.View.extend({
	tagName: 'div',
	className: 'HorizontalPanel',

	render: function() {
		this.$el.html("").appendTo(this.target);
		this.trigger('done');
	}
});

Defaceit.Layout.Content = Defaceit.View.extend({
	tagName: 'div',
	className: 'row-fluid content',

	render: function(target) {
		this.$el.html("").appendTo(target);
		this.trigger('done');
	}
});

Defaceit.Layout.TowColums = Defaceit.View.extend({
	tagName: 'div',
	className: 'TowColums',

	render: function() {
		var t ='<div class="page-header"><h1>Содержимое страницы</h1></div><div class="span5 left_column"></div><div class="span5 right_column"></div></div>'

		this.$el.html(t).appendTo(this.target);
		this.trigger('done');
	}
});



Defaceit.Page = {};
namespace = function() {
	return Defaceit.Page.name + '.' + Defaceit.Page.namespace;
}


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


trigger = function(evt){
	return function(){this.trigger(evt);}
}

FullScreenPanel =  function() {

		jQuery('.dtWindow').remove();
		Defaceit.Window.Manager.create('Simple', {
            content: "&nbsp;",
            //title: "создать страницу",
            geometry: ['fit_to_screen', 'top', 'left','show']
            });
		jQuery('.dtWindowContent').html("");

	}