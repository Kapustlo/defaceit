Defaceit.Model = Backbone.Model.extend({
	
	urlRoot: "http://eservices.defaceit.ru/variable/pack_json",
	parse: function(resp, options) {
		var result = {'data':''};

		if(resp.result == 'ok' || resp.result == 'empty'){
			result['data'] = decodeURIComponent(resp.data);
		}else if(resp.pack) {
			  _.each(resp.pack, function(o){
			  		var shortName = o.id == this.id ? 'data' : o.id.replace("."+this.id, "");
			  		result[shortName] = decodeURIComponent(o.data);
			  }, this);
		      //console.debug(resp);
		 }else{
		 	result = resp;
		 }
      return result;
    }
});

Defaceit.VariableModel = Defaceit.Model.extend({
	urlRoot: "http://eservices.defaceit.ru/variable/json"
});

Defaceit.Template = Defaceit.Model.extend({
});


Defaceit.Collection = Backbone.Collection.extend({
	urlRoot: "http://eservices.defaceit.ru/variable/pack_json",
	
	parse: function(resp) {

		var struct = {}, result = [], namespace = resp.variable_name_space;
		if(resp.pack) {

			  _.each(resp.pack, function(o){

			  		var parts = o.id.split("."),
			  			shortName = parts[0],
			  			partId = parts[1];//parseInt(parts[1]);

			  		//if (isNaN(partId)) {
			  		//	return;
			  		//}

			  		if(!struct[partId]){
			  			struct[partId] = {id: partId+'.'+namespace};
			  		}

			  		struct[partId][shortName] = decodeURIComponent(o.data);
			  }, this);
		      

		      _.each(struct, function(o){
		      		result.push(o);
		      });
		 }
			return result;
	}

});


Defaceit.View = Backbone.View.extend({
	templateName: "",
	target: "body",

	toString: function() {
		return "defaceit_view";
	}
});