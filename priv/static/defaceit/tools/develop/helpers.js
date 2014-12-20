Defaceit.Helpers = {
	domainValue: 'defaceit.ru',
	contextValue: '',

	list: function(name) {
		vars(Defaceit.Helpers.contextValue+'.'+Defaceit.Helpers.domainValue, name);
		return this;
		return Defaceit.Helpers.contextValue+'.'+Defaceit.Helpers.domainValue;
	},
	domain: function(domainName){
		return Defaceit.Helpers.domainValue = domainName;
	},

	context: function(contextName){
		Defaceit.Helpers.contextValue = contextName;
		return this;
	},


	edit: function(name, defaultAttrKey){
		var id = name + '.'+Defaceit.Helpers.contextValue+'.'+Defaceit.Helpers.domainValue;
		id = id.replace('..','.');
		defaultAttrKey = defaultAttrKey || 'value';

		this.currentTemplate = new Defaceit.Template({'id': id});

		this.currentTemplate.on('sync', function(){

			Defaceit.Helpers.Templates.currentView = new Defaceit.Helpers.Templates.EditView({model: this});
			if(defaultAttrKey){
				Defaceit.Helpers.Templates.currentView.defaultAttrKey = defaultAttrKey;
			}
		}, this.currentTemplate);
		this.currentTemplate.fetch();
		return defaultAttrKey+'.'+id;	
	},

	load: function(name){
		var id = name + '.'+Defaceit.Helpers.contextValue+'.'+Defaceit.Helpers.domainValue;
		
		var v = new Defaceit.Variable({'id':id});
		v.on('sync', function(data){
					new Defaceit.Helpers.Templates.EditView({model: v});
		});
		v.fetch();

		return id;
	},

	result: function(){
		return "test";
	}
}

Defaceit.Helpers.Templates = {
	list: function(){
			vars('templates.defaceit.ru');
			return '';
	},

	edit: function(name, defaultAttrKey){
		var id = name + '.templates.defaceit.ru';
		this.currentTemplate = new Defaceit.Template({'id': id});
		


		this.currentTemplate.on('sync', function(){

			Defaceit.Helpers.Templates.currentView = new Defaceit.Helpers.Templates.EditView({model: this});
			if(defaultAttrKey){
				Defaceit.Helpers.Templates.currentView.defaultAttrKey = defaultAttrKey;
			}
		}, this.currentTemplate);
		this.currentTemplate.fetch();
		
	},

	save: function(){
		Defaceit.Helpers.Templates.currentView.save();
	}
}


function list(block){
	var result = 'not found';
	_.each(Defaceit.Global.blocks, function(b){
		if(block == b[2]){
			result = b[0].toList();
		}
	});
	return result;
}

function edit(block, n){
	_.each(Defaceit.Global.blocks, function(b){
		if(block == b[2]){
			b[0].edit(n);
		}
	});
}

function vars(path, name){
	var o = {};
	$.getJSON('http://eservices.defaceit.ru/variable/pack_json/'+path,function(data){
		_.each(data.pack, function(d,k){
				var str = d.variable_name.replace(Defaceit.Helpers.domainValue,'')
										 .replace(Defaceit.Helpers.contextValue,'')
										 .replace(/\.\./g, '')
										 .replace(/\.*$/g, '');
				var fNames = str.split('.');
				var fSingleName = fNames.pop();
				if(fNames.length == 0){
					fNames.push('[no children]');
				}
				(o[fSingleName] = o[fSingleName] || []).push(' - '+fNames.join('.'));

		}, {async:false});
		if(name){
			console.info(o[name].join("\n"));
		}else{
			for(var key in o){
				console.info(key+":\n"+o[key].join("\n"));	
			}
			
		}
	});

}

function help(){
	console.info("You can use next commands:\n - list\n - edit\n - save");
	_.each(Defaceit.Global.blocks, function(b){
		console.info(b[2]);
	});
}



Defaceit.Helpers.Templates.EditView = Defaceit.View.extend({
	tagName: 'div',
	templateName: 'edit_form',
	defaultAttrKey: 'value',

	events: {
		'click .save': 'save',
		'click .cancel': 'cancel'
	},

	initialize: function(){
		if(!this.model){
			alert('You must specify a model for Template edit view.');
		}
		this.template = new Defaceit.Template({id: "edit_form.templates.defaceit.ru"});
		this.template.fetch();
		this.template.on('sync', this.render, this);
	},

	save: function() {
		//alert(this.editor.getValue());
		this.model.set(this.defaultAttrKey, this.editor.getValue());
    	//this.model.set('content', jQuery('#defaceit-article-content').val());
    	this.model.save();
    	this.model.once('sync', function(){alert('Model saved')}, this);
    	return false;
	},

	cancel: function() {
		this.trigger('done');
		return false;
	},

	render: function(){
		FullScreenPanel();
		//this.$el.html('<textarea id="code" name="code"></textarea>').appendTo('.dtWindowContent');
		this.$el.html(this.template.get('value')).appendTo('.dtWindowContent');

		var template = this.model.value || '<html></html>';

		this.$el.find('#code').val(template);
		this.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    		lineNumbers: true,
    		theme: "solarized light",
    		value: template,
    		mode: "htmlmixed"
  		});
		//jQuery('#defaceit-article-content').height(jQuery('#defaceit-article-content').height()+jQuery('.dtWindowContent').height()-jQuery('#article-form').height()-60);
	}
});


