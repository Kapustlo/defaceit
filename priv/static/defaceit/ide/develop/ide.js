Defaceit.Template = Backbone.Model.extend({
  parse: function(resp, options) {
    var result = resp;
    console.debug(!result.pack.length);
    if(resp.pack) {
        result = {};

        _.each(resp.pack, function(o){
            var shortName = o.variable_name.split(".")[0];//replace("."+this.id, "");
            result[shortName] = decodeURIComponent(o.data.message_text);
        }, this);
          //console.debug(resp);
     }
      return result;
    }
});


      var clientId = '767980261708.apps.googleusercontent.com';
      var apiKey = 'AIzaSyA439iqKhmzw7GJYJpd2f8n0Vil2-47Lq4';
      // To enter one or more authentication scopes, refer to the documentation for the API.
      var scopes = 'https://www.googleapis.com/auth/drive';

      // Use a button to handle authentication the first time.
      function handleClientLoad() {
        gapi.client.setApiKey(apiKey);
        window.setTimeout(checkAuth,1);
      }

      function checkAuth() {
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
      }

      function handleAuthResult(authResult) {
        var authorizeButton = document.getElementById('authorize-button');
        if (authResult && !authResult.error) {
          authorizeButton.style.visibility = 'hidden';
          loadPicker();
        } else {
          authorizeButton.style.visibility = '';
          authorizeButton.onclick = handleAuthClick;
        }
      }

      function handleAuthClick(event) {
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
        return false;
      }


    // Use the Google API Loader script to load the google.picker script.
    function loadPicker() {
      gapi.load('picker', {'callback': createPicker});
    }

    // Use your own API developer key.
    var developerKey = 'AIzaSyA439iqKhmzw7GJYJpd2f8n0Vil2-47Lq4';

    // Create and render a Picker object for searching images.
    function createPicker() {
      var view = new google.picker.View(google.picker.ViewId.DOCS);
      //view.setMimeTypes("image/png,image/jpeg,image/jpg, text/js");
      var picker = new google.picker.PickerBuilder()
          .enableFeature(google.picker.Feature.NAV_HIDDEN)
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .setAppId("767980261708.apps.googleusercontent.com")
          //.setOAuthToken(AUTH_TOKEN) //Optional: The auth token used in the current Drive API session.
          .addView(view)
          .addView(new google.picker.DocsUploadView())
          .setDeveloperKey(developerKey)
          .setCallback(pickerCallback)
          .build();
       picker.setVisible(true);
    }

    // A simple callback implementation.
    function pickerCallback(data) {
      if (data.action == google.picker.Action.PICKED) {
        var fileId = data.docs[0].id;
        

        gapi.client.load('drive', 'v2', function() {

          var request = gapi.client.drive.files.get({
            'fileId': fileId
          });
          request.execute(function(resp) {
              downloadFile(resp, function(d){
                new EditView({attributes:{data:d}});
              });
          });
        
        });
    }
}


    function downloadFile(file, callback) {
  if (file.downloadUrl) {
    var accessToken = gapi.auth.getToken().access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file.downloadUrl);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.onload = function() {
      callback(xhr.responseText);
    };
    xhr.onerror = function() {
      callback(null);
    };
    xhr.send();
  } else {
    callback(null);
  }
}

  FullScreenPanel =  function() {

    jQuery('.dtWindow').remove();
    Defaceit.Window.Manager.create('Simple', {
            content: "&nbsp;",
            //title: "создать страницу",
            geometry: ['fit_to_screen', 'top', 'left','show']
            });
    jQuery('.dtWindowContent').html("");;

  }


EditView = Backbone.View.extend({
  tagName: 'div',

  initialize: function(data){
    var that = this;

    this.data = data;
    this.template = new Defaceit.Template({id: "edit_page.template.ide.defaceit.ru"});
    this.template.urlRoot = "http://eservices.defaceit.ru/variable/get_pack_json",
    this.template.fetch();
    this.template.on('sync', this.render, this);
    setTimeout(function(){that.trigger('done');}, 10);
  },

  append: function(m, to){  
    m.list_view().render().$el.appendTo(to);
  },  


  render: function(){
    FullScreenPanel();
    this.$el.html(this.template.get('edit_page_widget')).appendTo('.dtWindowContent');
    //this.$el.find('#data').val(data);
    alert(this.attributes.data);
    this.trigger('done');
  }
});


Defaceit.load.js("https://apis.google.com/js/client.js?onload=handleClientLoad");
