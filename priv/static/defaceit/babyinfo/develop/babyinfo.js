Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/babyinfo/css/babycalc.css');

if (DefaceitHome) {
    Defaceit.load.css('http://sandbox.defaceit.ru/defaceit/tools/css/home.css');
}




/*    Defaceit.Window.Manager.create('Simple', {
            content: "Loading...",
            //title: "создать страницу",
            geometry: ['center','show']
            });*/

Defaceit.load.image('http://sandbox.defaceit.ru/images/widget/radio_button.png');
Defaceit.load.image('http://sandbox.defaceit.ru/images/widget/small_radio_button.png');
Defaceit.load.image('http://sandbox.defaceit.ru/images/widget/calc_bg.png');
Defaceit.load.image('http://sandbox.defaceit.ru/defaceit/babyinfo/images/pregnant.jpg');



BabyInfo = _.extend({
  app: 'babyinfo.babywonder.ru',
  create: function(name){
    var id = [name, 'babyinfo', 'babywonder.ru'].join('.');
    return new Defaceit.Model({'id': id});
  },


  start: function(){

    BabyInfo.renderSelection = true;

    if(window.BabyInfoConfig){
      _.each(BabyInfoConfig, function(o, key){
        BabyInfo[key] = o;
      });
    }else{
      var r = false;
      BabyInfo.userName = ( (r = /\/babyinfo\/([^\/]*)/.exec(document.location))?r[1]:undefined);
    }

    if(!BabyInfo.userName){
      throw('BabyInfoApp: you should specify userName via BabyInfoConfig object or url');
      return;
    }


    BabyInfo.children = new Defaceit.Collection({'id':BabyInfo.userName}, {url:"http://eservices.sandbox.defaceit.ru/variable/pack_json/"+BabyInfo.userName+'.'+BabyInfo.app});
    BabyInfo.children.on('sync', function(){
            BabyInfo.trigger('updated');

            var content = '';//<h2>'+BabyInfo.userName+'</h2>';
            this.each(function(baby){
                content += '<div class="dibfix"><div class="rel"><a href="http://www.babywonder.ru/blogs/"><img class="round_avatar" width="100" height="100" alt="comm" src="http://www.babywonder.ru/templates/skin/diggstreet/images/baby.jpg">'+baby.get('name')+diff_date(new Date(baby.get('birthday') || baby.get('pregnantdate') || baby.get('planingdate')), 1000 * 3600 * 24 *7) + '</a></div></div>';
                //content += '<div class="rel">'+baby.get('name') + ' '+baby.get('sex')+'<br />';
            });


            var h = jQuery('#babyinfo-children');
            if(h.length){
              h.append(content);
            }else{
                Defaceit.Window.Manager.create('Simple', {
                          content: content,
                          //buttons: [{text: "Добавить", handler: calc_action}, {text: "Закрыть", handler: function(){this.wnd_handler.remove();}}],
                          geometry:['width:200', 'left', 'top', 'show']
                });
       
            }
    }, BabyInfo.children);
    BabyInfo.children.fetch();


    if(BabyInfo.renderSelection){
    var template = new Defaceit.VariableModel({'id':'selection.template.'+BabyInfo.app});
    var wnd = null;
        template.on('sync', function(){
            wnd = Defaceit.Window.Manager.create('Simple', {
              content: this.get('data'),
              //buttons: [{text: "Добавить", handler: calc_action}, {text: "Закрыть", handler: function(){this.wnd_handler.remove();}}],
              geometry:['width:750', 'center', 'top', 'show']
        });

            function deactive(group_name) {
      jQuery(group_name + ' .button').each(function(i, b){jQuery(b).removeClass('active');});
  }

  function activate() {
      jQuery('#calc img').each(
    function(i, b){
            var el = jQuery(b);
        el.click(function(){wnd.wnd_handler.remove(); BabyInfo.trigger('render',jQuery(this).attr('id'));});
      });
  }
  activate();
 

        }, template);

        template.fetch();
      }
  },

  run: function(action){

    if(BabyInfo[action] === undefined){
        BabyInfo[action] = function(){h.edit(action)};

        var template = new Defaceit.VariableModel({'id':action+'.template.'+BabyInfo.app});
        template.on('sync', function(){jQuery(this.get('data')).appendTo('head'); BabyInfo[action]()}, template);
        template.fetch();
    }else{
      BabyInfo[action]();
    }
  }
}, Backbone.Events);

BabyInfo.on('render', BabyInfo.run);

//if (/defaceit\.ru/.test(document.location)) {
    Defaceit.wait("jQuery", BabyInfo.start, this, ["jQuery"]);
//}


function diff_date(d, period){
 
  period = period || 1000 * 3600 * 24;
  var date2 = new Date();
  var timeDiff = Math.abs(date2.getTime() - d.getTime());
  return (isNaN(timeDiff)?'':Math.ceil(timeDiff / (period))); 
}
  

