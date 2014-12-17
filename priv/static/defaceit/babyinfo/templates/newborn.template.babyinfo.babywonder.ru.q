<script id="newborn_tpl" type="text/x-jquery-tmpl">

<style>
  .child_name{
    display: block;
    margin: 0 auto;
    line-height: 2em;
    font-weight: bold;
    font-size: 2em;
    color:#623F1D;
    width: 300px;
    text-align: center;
    
  }
</style>

<div id="calc">
<form class="calc_form">
  <div class="calc_line"><p class="calc_label">Укажите имя ребенка:<input class="child_name" type="text" /></p></div>

<div class="calc_line">
<div class="large_radio_group sexinfo"><div class="button active">Девочка</div><div class="button">Мальчик</div></div>
</div>



<div class="calc_line">
<p class="calc_label">Дата рождения ребенка
    <select id="profile_birthday_day" name="profile_birthday_day"><option value="">день</option></select>
    <select id="profile_birthday_month" name="profile_birthday_month"><option value="">месяц</option></select>
    <select id="profile_birthday_year" name="profile_birthday_year"><option value="">год</option></select>
  </p>
</div>
  

</form>
</div>

<script>
  setTimeout(
  function(){
  function deactive(group_name) {
      jQuery(group_name + ' .button').each(function(i, b){jQuery(b).removeClass('active');});
  }

  function activate(group_name) {
      jQuery(group_name + ' .button').each(
    function(i, b){
            var el = jQuery(b);
        el.click(function(){deactive(group_name); el.addClass('active');});
      });
  }
  activate('.sexinfo');
  }, 0);
</script>
  
</script>


<script>
  
  BabyInfo.newborn = function(){
    function getNewbornChild(){
        var newbornChild = null;
      BabyInfo.children.each(function(c){
          if(c.get('pregnantdate') && !c.get('birthday')){
            newbornChild = c;
          }
      }, this);
        return newbornChild;
    }
    
    
   function append(){
    
       
      var name = jQuery('.child_name').val();
      var sex = jQuery('.sexinfo .active').html();
      var birthday = [jQuery('#profile_birthday_month').val(), jQuery('#profile_birthday_day').val(),jQuery('#profile_birthday_year').val()].join('.');
      var newborn = getNewbornChild();
      var childId = ['child'+(BabyInfo.children.length+1), BabyInfo.userName, BabyInfo.app].join('.');

       
      if(newborn){
        var newbornPregnantDate = new Date(newborn.get('pregnantdate'));
        var birthdayDate = new Date(birthday);
        if(birthdayDate.getTime() > newbornPregnantDate.getTime()){
           childId = newborn.get('id');
        }
      }
       
      var child = new Defaceit.Model({'id': childId});
      child.set('name', name);
      child.set('sex', sex);
      child.set('birthday', birthday);
       
      child.once('sync', function(){BabyInfo.children.fetch();});
      child.save();

    }

            Defaceit.Window.Manager.create('Simple', {
              content: jQuery('#newborn_tpl').html(),
              buttons: [{text: "Добавить", handler: append}, {text: "Закрыть", handler: function(){this.wnd_handler.remove();}}],
              geometry:['width:750', 'center', 'show']
        });
    
    var months_enum = ['январь', 'февраль','март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь','октябрь','ноябрь','декабрь'];

    var years = jQuery('#profile_birthday_year'),
        months = jQuery('#profile_birthday_month');
        days = jQuery('#profile_birthday_day');
    
    if(years.length > 0){for(var y=2010; y<=2014;y++){    years.append('<option>'+y+'</option>'); }}
    if(months.length > 0){_.each(months_enum, function(m, i){months.append('<option value="'+(i+1)+'">'+m+'</option>');});}
    if(days.length > 0){for(var d=1; d<=31; d++){ days.append('<option>'+d+'</option>'); }}
  
  }



</script>


