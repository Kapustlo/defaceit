Defaceit.App.email.register_email = function(){
  jQuery('#info').remove();
  jQuery('.launch-head').remove();
  jQuery('#signup-sect p:first').html('Скопируйте текст из окна на ваш сайт');
  jQuery('.flex-container').html(_.template(jQuery('#register_email_tpl').html(), Defaceit.App.email));
  
  $('#submit-email').click( function(e) {
    Defaceit.App.email.trigger('exec', 'sendform');
  });
}


