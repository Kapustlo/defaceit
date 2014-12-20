if (!Defaceit.Variable) {


	Defaceit.Variable = function(o){
		this.id = o.id.replace('..', '.');
	}

	Defaceit.Variable.prototype = _.extend(Defaceit.Variable.prototype, {
		fetch: function(){
			var that = this;		
			$.getJSON('http://eservices.defaceit.ru/variable/get_json/'+this.id,function(data){
				that.value = decodeURIComponent(data[that.id]);
				that.trigger('sync', data, that);
			}, {async:false});
		}
	}, Backbone.Events);
	
}

