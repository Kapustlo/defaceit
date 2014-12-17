<script id="pregnancy_planing_tpl" type="text/x-jquery-tmpl">
<div id="calc">
<form class="calc_form">
<div class="calc_line">
<p class="calc_label">Планирую с:
		<select id="profile_birthday_day" name="profile_birthday_day"><option value="">день</option></select>
		<select id="profile_birthday_month" name="profile_birthday_month"><option value="">месяц</option></select>
		<select id="profile_birthday_year" name="profile_birthday_year"><option value="">год</option></select>
  </p>
</div>
</script>

<script>
BabyInfo.pregnancy_planing = function(){
	 function append(){
      var planingDate = [jQuery('#profile_birthday_month').val(), jQuery('#profile_birthday_day').val(),jQuery('#profile_birthday_year').val()].join('.');
      var childId = ['child'+(BabyInfo.children.length+1), BabyInfo.userName, BabyInfo.app].join('.');
      var child = new Defaceit.Model({'id': childId});

      child.set('name', 'Планирую');
      child.set('planingdate', planingDate);
       
      child.once('sync', function(){BabyInfo.children.fetch();});
      child.save();

    }

            Defaceit.Window.Manager.create('Simple', {
              content: jQuery('#pregnancy_planing_tpl').html(),
              buttons: [{text: "Добавить", handler: append}, {text: "Закрыть", handler: function(){this.wnd_handler.remove();}}],
              geometry:['width:750', 'center', 'show']
        });
    
    var months_enum = ['январь', 'февраль','март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь','октябрь','ноябрь','декабрь'];

    var years = jQuery('#profile_birthday_year'),
        months = jQuery('#profile_birthday_month');
        days = jQuery('#profile_birthday_day');
    
    if(years.length > 0){for(var y=2010; y<=2014;y++){    years.append('<option>'+y+'</option>');	}}
    if(months.length > 0){_.each(months_enum, function(m, i){months.append('<option value="'+(i+1)+'">'+m+'</option>');});}
    if(days.length > 0){for(var d=1; d<=31; d++){ days.append('<option>'+d+'</option>'); }}
}
</script>

