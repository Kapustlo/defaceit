Defaceit.load.css('http://defaceit.ru/defaceit/email/css/email.css');

Defaceit.App = Defaceit.App || {};
Defaceit.Config = Defaceit.Config || {};


Defaceit.App.email = _.extend({
  app: 'email.ru',
  appShortName: 'email',
  version:'0.1',

  route: function(){
    hash =/\/email\/([0-9abcdef]{32})$/.exec(document.location);

    if(hash){
        this.hash = hash[1];
        return "sendform";
    }
    return "main";
  },
  
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
        template.on('sync', function(){jQuery(this.get('data')).appendTo('head'); Defaceit.App.email[action]()}, template);
        template.fetch();
    }else{
      this[action]();
    }
  }
}, Backbone.Events);


Defaceit.App.email.on('exec', Defaceit.App.email.exec, Defaceit.App.email);





_.templateSettings = {
  interpolate: /\[\[(.+?)\]\]/g
};


if(Defaceit.Config.email && Defaceit.Config.email.start_action){
    Defaceit.App.email.trigger('exec', Defaceit.Config.email.start_action);
}else{
    Defaceit.App.email.trigger('exec', Defaceit.App.email.route());
}



Snappy = {};
Snappy.data = {};

Snappy.data.IFrameProxy = function(url) {
    this.url = url;
    this.create_iframe();
    this.create_form(url);
}

Snappy.data.IFrameProxy.prototype = {
  
    create_iframe: function() {
        if (jQuery('#coaframe').length > 0) {
            return;
        }
    
        var iframe = document.createElement("iframe");
        iframe.name = "coaframe";
    
        iframe.style.visibility = "hidden";
        iframe.style.position = "absolute";
        iframe.style.left = iframe.style.top = "0px";
        iframe.height = width = "1px";

        iframe.id = 'coaframe';
        var h = document.getElementsByTagName("body")[0]
        h.appendChild(iframe);
    },
  
    create_form: function(url) {
    
        var form = jQuery('#coaform');
    
        if (form.length) {
            form.remove();
            return;
        }
    
        form = this.form = document.createElement("form")
        form.style.display = "none"
        form.id = "coaform";
        form.enctype = "multipart/form-data"
        form.method = "POST"
        form.action = url;
        form.target = 'coaframe';
        form.setAttribute("target", 'coaframe');
        document.body.appendChild(form);  
    },
  
    add: function(name, value) {
        var element = document.createElement('input');
        element.type="hidden";
        element.name=name;
        element.value=value;
        this.form.appendChild(element);
    },
  
    request: function() {
        this.form.submit();
    }
}
Snappy.data.JSONP = {
    callbacks: { 
        undefined: {callback: function(){alert('You should return uniq "key" in your data response!!!');}, scope: this},
        'null': {callback: function(){alert('You should return uniq "key" in your data response!!!');}, scope: this}
    },
    request: function (url) {
    var script = document.createElement("script");
        script.src = url;
        var h = document.getElementsByTagName("body")[0]
        h.appendChild(script);
     },

    register: function(key, callback, scope) {
        Snappy.data.JSONP.callbacks[key] = {callback: callback, scope: scope}
    }

}

function defaceit_callback(data) {
    func = Snappy.data.JSONP.callbacks[data.key];
    func.callback.call(func.scope, data);
}