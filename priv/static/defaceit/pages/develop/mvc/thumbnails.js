Thumbnail = Defaceit.Model.extend({
	defaults: {
		title: "",
		content: "",
		url: ""
	}

});

Thumbnails = Defaceit.Collection.extend({
	model: Thumbnail,
	toList: function(){
		var result = [];
		_.each(this.models, function(m){
			result.push(m.get('title'));
		});
		
		return result;
	}
});

ThumbnailView = Defaceit.View.extend({
	tagName: 'dd',

	events: {
		click: "edit"
	},

	edit: function() {
		new ThumbnailEditView();
		//this.model.set('title', "some another title??");
		//this.model.save();
		//this.model.on('sync', trigger('done'), this);
		return false;
	},
	render: function(){
		this.$el.html('<a href="#">'+this.model.get('title')+'</a>');
		return this;
	}
});

ThumbnailsView = Defaceit.View.extend({
	tagName: 'dl',
	className: "dl-horizontal",

	render: function() {
		var that = this, str = "";
		this.$el.append('<dt>Заметки:</dt>')
		_.each(this.model.models, function(m){
			that.$el.append(new ThumbnailView({model:m}).on('done', trigger('changed'), this).render().$el);
		},this);
		return this;
	}
});


var ThumbnailEditView = Defaceit.View.extend({
	tagName: 'div',
	templateName: 'codeeditor_page_widget',

	events: {
		'click .save': 'save',
		'click .cancel': 'cancel'
	},

	initialize: function(){
		this.template = new Defaceit.Model({id: "codeeditor_page_widget.template.defaceit.ru"});
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
		this.$el.html('<textarea id="code" name="code"></textarea>').appendTo('.dtWindowContent');
		this.$el.html(this.template.get('codeeditor_page_widget')).appendTo('.dtWindowContent');

		this.$el.find('#defaceit-article-title').val(this.model.get('title'));
		this.$el.find('#defaceit-article-content').val(this.model.get('content'));
			
		jQuery('#defaceit-article-content').height(jQuery('#defaceit-article-content').height()+jQuery('.dtWindowContent').height()-jQuery('#article-form').height()-60);
	}
});
