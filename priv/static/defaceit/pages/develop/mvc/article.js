/**
 *	Here you can find the Model and Views for Article entity
 *  Templates wich we use:
 * 		article.namespace
 */

var Article = Defaceit.Model.extend({
	//url: "defaceit.ru",
	urlRoot: "http://eservices.defaceit.ru/variable/pack_json",

	defaults: {
		title: "",
		content: ""
	},

	toList: function(){
		return [this.get('title')];
	}

});


var ArticleListView =  Defaceit.View.extend({
		tagName: 'dl',
		className: "dl-horizontal",

		events: {
			click: "edit"
		},

		edit: function() {
			new ArticleEditView({model:this.model}).on('done', trigger('changed'), this);
			return false;
		},

		render: function() {
			//console.debug(this.options.target);
			this.$el.html("<dt>Статья:</dt><dd><a href='#' onclick='return false;'>"+this.model.get('title')+"</a></dd>");

			return this;
		}
	});


var ArticleEditView = Defaceit.View.extend({
	tagName: 'div',


	events: {
		'click .save': 'save',
		'click .cancel': 'cancel'
	},

	initialize: function(){
		this.template = new Defaceit.Model({id: "article.template.defaceit.ru"});
		this.template.urlRoot = "http://eservices.defaceit.ru/variable/pack_json",
		this.template.fetch();
		this.template.on('sync', this.render, this);
	},

	save: function() {
		this.model.set('title', jQuery('#defaceit-article-title').val());
    	this.model.set('content', jQuery('#defaceit-article-content').val());
    	this.model.save();
    	this.model.once('sync', function(){this.trigger('done');}, this);
    	return false;
	},

	cancel: function() {
		this.trigger('done');
		return false;
	},

	render: function(){
		FullScreenPanel();
		this.$el.html(this.template.get('article')).appendTo('.dtWindowContent');

		this.$el.find('#defaceit-article-title').val(this.model.get('title'));
		this.$el.find('#defaceit-article-content').val(this.model.get('content'));
			
		jQuery('#defaceit-article-content').height(jQuery('#defaceit-article-content').height()+jQuery('.dtWindowContent').height()-jQuery('#article-form').height()-60);
	}
});
