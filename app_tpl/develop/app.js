Defaceit.load.css('{{dev_url}}/defaceit/{{appid}}/css/{{appid}}.css');

Defaceit.App = Defaceit.App || {};
Defaceit.Config = Defaceit.Config || {};


Defaceit.App.{{app_class}} = _.extend({
  app: '{{appid}}.ru',
  appShortName: '{{appid}}',
  version:'0.1',
  
  debug: function(){
    // Debug is off
  },
  /*main: function(){
    jQuery('.defaceit-action').each(function(key, o){
        jQuery(o).click(function(){Defaceit.App.messages.trigger('exec', jQuery(o).attr('id')); return false;});
          });
    },*/
  exec: function(action){

    this.debug('Получено событие:'+action);
    
    if(this[action] === undefined){
        this[action] = function(){Defaceit.Helpers.edit(action)};

        var template = new Defaceit.VariableModel({'id':action+'.template.'+this.app});
        template.on('sync', function(){jQuery(this.get('data')).appendTo('head'); Defaceit.App.{{app_class}}[action]()}, template);
        template.fetch();
    }else{
      this[action]();
    }
  }
}, Backbone.Events);


Defaceit.App.{{app_class}}.on('exec', Defaceit.App.{{app_class}}.exec, Defaceit.App.{{app_class}});

if(Defaceit.Config.{{app_class}} && Defaceit.Config.{{app_class}}.start_action){
    Defaceit.App.{{app_class}}.trigger('exec', Defaceit.Config.{{app_class}}.start_action);
}else{
    Defaceit.App.{{app_class}}.trigger('exec', 'main');
}