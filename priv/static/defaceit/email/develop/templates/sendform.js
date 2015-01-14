Defaceit.App.email.sendform = function(){
  jQuery('#info').remove();
  jQuery('.launch-head').remove();
  jQuery('#signup-sect p:first').html('Укажите Ваш электронный адрес, тему и текст сообщения');
  jQuery('.flex-container').html(jQuery('#sendform_tpl').html());



   $('#input-email, #subject').bind({
        focus: function(){
            $('#error').slideUp();
            if($(this).val() == $(this).attr('placeholder')){
              $(this).val('');
            }
        },
        blur: function() {
            if($(this).val() == '') {
                $(this).val($(this).attr('placeholder'));
            }
        }
    });
  
  $('#submit-email').click( function(e) {
    
            // Animate background
            $('.fancy-form').animate({backgroundPositionX: 120}, 2000, function() {
                 $(this).css('background-position-x', '0');
                }
            );    
    
    sender = new Snappy.data.IFrameProxy("http://services.defaceit.ru/email/send_message");
    form_fields = {
      'from':jQuery('#input-email').val(),
      'title': jQuery('#subject').val(),
      'message': jQuery('#message').val(),
      'email_hash':Defaceit.App.email.hash
    };
                for(key in form_fields) {
                    sender.add(key, form_fields[key]);
                }
                
                var check_send_result = function() {
          switch(document.location.hash){
            case '#status=ok': 
              alert('Успешно!');
              document.location = document.referrer
            break;
          
            case '#status=error':
              alert('Error');
              document.location = document.referrer;
            break;
            
            default: 
              setTimeout(check_send_result, 200);
          }
        }
        setTimeout(check_send_result, 200);
        
        sender.request();
        return false;
  });
}