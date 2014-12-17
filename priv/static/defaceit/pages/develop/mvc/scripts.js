var Script = Defaceit.Model.extend({
	defaults: {
		origin: "",
		source: ""
	}
});

Scripts = Defaceit.Collection.extend({
	model: Script,

	toList: function(){
		var result = [];
		_.each(this.models, function(m){
			result.push(m.get('origin'));
		});

		return result;
	}
}); 


ScriptLineView = Defaceit.View.extend({
	tagName: 'dd',

	events: {
		click: "edit"
	},

	edit: function() {
		new ScriptEditFormView({model: this.model});
		//this.model.set('title', "some another title??");
		//this.model.save();
		//this.model.on('sync', trigger('done'), this);
		return false;
	},
	render: function(){
		this.$el.html('<a href="#">'+this.model.get('origin')+'</a>');
		return this;
	}
});

ScriptsListView = Defaceit.View.extend({
	tagName: 'dl',
	className: "dl-horizontal",

	render: function() {
		var that = this, str = "";
		this.$el.append('<dt>Скрипты:</dt>')
		_.each(this.model.models, function(m){
			that.$el.append(new ScriptLineView({model:m}).on('done', trigger('changed'), this).render().$el);
		},this);
		return this;
	}
});



function help(){
	console.info("You can use next commands:\n - list\n - edit\n - save");
	_.each(Defaceit.Global.blocks, function(b){
		console.info(b[2]);
	});
}


var ScriptEditFormView = Defaceit.View.extend({
	tagName: 'div',
	templateName: 'edit_form',

	events: {
		'click .save': 'save',
		'click .cancel': 'cancel'
	},

	initialize: function(){
		this.template = new Defaceit.Model({id: "script.templates.sandbox.defaceit.ru"});
		this.template.fetch();
		this.template.on('sync', this.render, this);
	},

	save: function() {
		alert(this.editor.getValue());
		this.model.set('source', this.editor.getValue());
    	//this.model.set('content', jQuery('#defaceit-article-content').val());
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
		//this.$el.html('<textarea id="code" name="code"></textarea>').appendTo('.dtWindowContent');
		this.$el.html(this.template.get(this.templateName)).appendTo('.dtWindowContent');
		this.$el.find('#code').val(this.model.get('source'));
		this.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    		lineNumbers: true,
    		theme: "solarized light",
    		value: this.model.get('source'),
    		mode: "htmlmixed"
  		});
		//jQuery('#defaceit-article-content').height(jQuery('#defaceit-article-content').height()+jQuery('.dtWindowContent').height()-jQuery('#article-form').height()-60);
	}
});