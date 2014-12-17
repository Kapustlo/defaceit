Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/test/css/test.css');

Defaceit.App = Defaceit.App || {};
Defaceit.Config = Defaceit.Config || {};


Defaceit.App.test = _.extend({
  app: 'test.ru',
  appShortName: 'test',
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
        template.on('sync', function(){jQuery(this.get('data')).appendTo('head'); Defaceit.App.test[action]()}, template);
        template.fetch();
    }else{
      this[action]();
    }
  }
}, Backbone.Events);


Defaceit.App.test.on('exec', Defaceit.App.test.exec, Defaceit.App.test);

if(Defaceit.Config.test && Defaceit.Config.test.start_action){
    Defaceit.App.test.trigger('exec', Defaceit.Config.test.start_action);
}else{
    Defaceit.App.test.trigger('exec', 'main');
}