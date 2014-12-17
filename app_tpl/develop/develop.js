Defaceit.debug = function(message){console.debug(message);}

Defaceit.App.{{appid}}.debug = Defaceit.debug || Defaceit.App.{{appid}}.debug;
       
App = Defaceit.App.{{appid}};
        
h = Defaceit.Helpers;
h.domain(Defaceit.App.{{appid}}.app);
h.context('template');


_.templateSettings = {
  interpolate: /\[\[(.+?)\]\]/g
};

function color_write(message, result){
    document.write(message+'<span style="color:green">'+result+'</span><br/>');
    console.log('%c '+message+result, 'color: green');
}

color_write('Project name:', '{{appid}}');
color_write('Version:', Defaceit.App.{{appid}}.version);
color_write('Debug:', !((App.debug+'').replace(/\n/g,'').replace('function (){    // ','').replace('  }','') == 'Debug is off'));
color_write('Variables domain:', h.domainValue);
color_write('Variables context:', h.contextValue);

/*
<h1>Help</h1>
App - короткая ссылка на приложение
h - короткая ссылка на Defaceit.Helpers
*/