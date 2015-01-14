Defaceit.App.email.main = function(){
var launchPage = {
    url: 'submit.html',
    sent: false,
    formBgWidth: 120
}
$(document).ready( function() {
    $('.flex-container').html($('#main_tpl').html());
    $('#info').html($('#info_tpl').html());
    $('.launch-head').html($('#launch-head_tpl').html());


    $('#input-email').bind({
        focus: function(){
            $('#error').slideUp();
            if($(this).val() == 'your@email.com') {
                $(this).val('');
            }
        },
        blur: function() {
            if($(this).val() == '') {
                $(this).val('your@email.com');
            }
        }
    });
    
    $('#submit-email').click( function(e) {
        e.preventDefault();
        $('#error').slideUp();
        $('#resp').html('');
        $('#submit-email').attr('disabled', true);
        if($('#input-email').val().match(/^\S+@\S+\.\S+$/) && launchPage.sent !== true && $('#input-email').val() != 'your@email.com' ) {
            // Animate background
            $('.fancy-form').animate({backgroundPositionX: launchPage.formBgWidth}, 2000, function() {
                 $(this).css('background-position-x', '0');
                }
            );
            // POST email address
            var success = function(response){
                      Defaceit.App.email.hash = response.email.email_hash;
                        Defaceit.App.email.trigger('exec','register_email'); 
            }
                   
            Snappy.data.JSONP.register('uniqkey', success, this)
            Snappy.data.JSONP.request("http://services.defaceit.ru/email/email_add?key=uniqkey&email=" + jQuery('#input-email').val())
                    
        } else if(launchPage.sent == true) {
        
        } else {
            $('#submit-email').attr('disabled', false);
            $('#error').html('<p class="error">Введите корректный адрес электронной почты</p>');
            $('#error').slideDown();
        }
    });
});
}


