Defaceit.load.css('http://defaceit.ru/defaceit/messages/css/messages.css');

Defaceit.App = Defaceit.App || {};
Defaceit.Config = Defaceit.Config || {};


Defaceit.App.messages = _.extend({
  app: 'messages.ru',
  appShortName: 'messages',
  version:'0.1',
  
  debug: function(){
    // Debug is off
  },
  main: function(){
    jQuery('.defaceit-action').each(function(key, o){
        jQuery(o).click(function(){Defaceit.App.messages.trigger('exec', jQuery(o).attr('id')); return false;});
          });
    },
  exec: function(action){

    this.debug('Получено событие:'+action);
    
    if(this[action] === undefined){
        this[action] = function(){Defaceit.Helpers.edit(action)};

        var template = new Defaceit.VariableModel({'id':action+'.template.'+this.app});
        template.on('sync', function(){jQuery(this.get('data')).appendTo('head'); Defaceit.App.messages[action]()}, template);
        template.fetch();
    }else{
      this[action]();
    }
  }
}, Backbone.Events);


Defaceit.App.messages.on('exec', Defaceit.App.messages.exec, Defaceit.App.messages);

if(Defaceit.Config.messages && Defceit.Config.messages.start_action){
    Defaceit.App.messages.trigger('exec', Defaceit.Config.messages.start_action);
}else{
    Defaceit.App.messages.trigger('exec', 'main');
}