
function isDefaceit(){
	return 'Defaceit mode available';
}


function help(){
	return 'В режиме командной строки вы можете использовать:' + "\n" 
		   + 'Defaceit.Helpers' + '\n'
		   + 'Defaceit.Templates';

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


Defaceit.Helpers = {
	domainValue: 'sandbox.defaceit.ru',
	contextValue: '',

	ll: function(){
		vars(Defaceit.Helpers.domainValue);
		return Defaceit.Helpers.domainValue;
	},

	list: function(name) {
		vars(Defaceit.Helpers.contextValue+'.'+Defaceit.Helpers.domainValue, name);
		return Defaceit.Helpers.contextValue+'.'+Defaceit.Helpers.domainValue;
	},
	domain: function(domainName){
		return Defaceit.Helpers.domainValue = domainName;
	},

	context: function(contextName){
		Defaceit.Helpers.contextValue = contextName;
		return this;
	},

	ee: function(name, defaultAttrKey){
		var id = name + '.'+Defaceit.Helpers.domainValue;
		id = id.replace('..','.');

		this.currentTemplate = new Defaceit.VariableModel({'id':id});
		//this.currentTemplate = new Defaceit.Model({'id':id});

		this.currentTemplate.on('sync', function(){

			Defaceit.Helpers.Templates.currentView = new Defaceit.Helpers.Templates.EditView({model: this});
			if(defaultAttrKey){
				Defaceit.Helpers.Templates.currentView.defaultAttrKey = defaultAttrKey;
			}
		}, this.currentTemplate);
		this.currentTemplate.fetch();
		return id;	
	},

	edit: function(name, defaultAttrKey){
		var id = name + '.'+Defaceit.Helpers.contextValue+'.'+Defaceit.Helpers.domainValue;
		id = id.replace('..','.');

		this.currentTemplate = new Defaceit.VariableModel({'id':id});


		//this.currentTemplate = new Defaceit.Model({'id':id});

		this.currentTemplate.on('sync', function(){

			Defaceit.Helpers.Templates.currentView = new Defaceit.Helpers.Templates.EditView({model: this});
			Defaceit.Helpers.Templates.currentView.temp = {action: name};
			if(defaultAttrKey){
				Defaceit.Helpers.Templates.currentView.defaultAttrKey = defaultAttrKey;
			}
		}, this.currentTemplate);
		this.currentTemplate.fetch();
		return id;	
	},

	activate: function(name){
		name = name.translit().toLowerCase();

		var id = name + '.'+Defaceit.Helpers.contextValue+'.'+Defaceit.Helpers.domainValue;
		this.cache = this.cache || {};
		this.activeModel = (this.cache[id] = this.cache[id] || new Defaceit.Model({'id':id}));
		return this.activeModel;
	},

	fetch: function(){
		this.activeModel && this.activeModel.fetch();
		return this;
	},

	toJSON: function(){
		return this.activeModel && this.activeModel.toJSON();
	},
	save: function(){
		this.activeModel && this.activeModel.save();
		return this;
	},
	load: function(name){
		var id = name + '.'+Defaceit.Helpers.contextValue+'.'+Defaceit.Helpers.domainValue;
		
		var v = new Defaceit.Model({'id':id});
		v.on('sync', function(data){
					new Defaceit.Helpers.Templates.EditView({model: v});
		});
		v.fetch();

		return v;
	},

	result: function(){
		return "test";
	},
	info: function(){
		out = [
			"domain:"+this.domainValue,
			"context:"+this.contextValue
		];

		return out.join("\n");
	},
	help: function(){
		var out = [
			"Sample:",
			"Defaceit.Helpers.domain('sandbox.defaceit.ru');",
			"Defaceit.Helpers.context('babywonder');",
			"Defaceit.Helpers.list();",
			"Defaceit.Helpers.activate(<modelName>)"
		]

		return out.join("\n");
	}
}

Defaceit.Helpers.Templates = {
	list: function(){
			vars('templates.sandbox.defaceit.ru');
			return '';
	},

	edit: function(name, defaultAttrKey){
		var id = name + '.templates.sandbox.defaceit.ru';
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
	$.getJSON('http://eservices.sandbox.defaceit.ru/variable/pack_json/'+path,function(data){
		_.each(data.pack, function(d,k){
				var str = d.id.replace(Defaceit.Helpers.domainValue,'')
										 .replace(Defaceit.Helpers.contextValue,'')
										 .replace(/\.\./g, '')
										 .replace(/\.*$/g, '');
				var fNames = str.split('.');
				var fSingleName = fNames.pop();
				if(fNames.length == 0){
					fNames.push('.');
				}

				(o[fSingleName] = o[fSingleName] || []).push(' - '+fNames.join('.'));
		}, {async:false});

		if(name){
			console.info(o[name].join("\n"));
		}else{
			for(var key in o){
				o[key] = o[key].sort();
				console.info(key+":\n"+o[key].join("\n"));	
			}
			
		}
	});

}



Defaceit.Helpers.Templates.EditView = Defaceit.View.extend({
	tagName: 'div',
	templateName: 'edit_form',
	defaultAttrKey: 'data',

	events: {
		'click .save': 'save',
		'click .cancel': 'cancel'
	},

	initialize: function(){
		if(!this.model){
			alert('You must specify a model for Template edit view.');
		}
		this.template = new Defaceit.Template({id: "edit_form.templates.sandbox.defaceit.ru"});
		this.template.fetch();
		this.template.on('sync', this.render, this);
	},

	save: function() {
		//alert(this.editor.getValue());
		this.model.set(this.defaultAttrKey, escape(this.editor.getValue()));
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
		console.debug(this.model.toJSON());
		FullScreenPanel();
		//this.$el.html('<textarea id="code" name="code"></textarea>').appendTo('.dtWindowContent');
		this.$el.html(this.template.get('value')).appendTo('.dtWindowContent');


		var template = this.model.get(this.defaultAttrKey) || _.template(jQuery('#default_tpl').html().replace('<!--', '').replace('-->', ''), this.temp) || '<html></html>';

		this.$el.find('#code').val(template);
		this.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    		lineNumbers: true,
    		theme: "solarized light",
    		value: template,
    		mode: "htmlmixed"
  		});
  		jQuery('.CodeMirror').height(parseInt(jQuery('.dtWindowContent').height())-100);
		//jQuery('#defaceit-article-content').height(jQuery('#defaceit-article-content').height()+jQuery('.dtWindowContent').height()-jQuery('#article-form').height()-60);
	}
});


