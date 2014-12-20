
(function(){
Defaceit.load.css('http://defaceit.ru/defaceit/babycalc/css/babycalc.css');
Defaceit.load.css('http://defaceit.ru/defaceit/tools/css/home.css');


BlocksListView = Defaceit.View.extend({
	tagName: 'div',
	target: '.dtWindowContent',
	templateName: 'edit_page_widget',

	initialize: function(){
		this.blocks = [];
	},

	set_data: function(blocks){
		this.blocks = blocks;
		return this;
	},

	render: function(){
		FullScreenPanel();
		this.$el.html(this.model.get(this.templateName)).appendTo(this.target);

		_.each(this.blocks, function(b){
			var blockModel = b[0],
				blockView = b[1],
				target = b[2];

			new blockView({model: blockModel})
				.once('changed', this.render, this)
				.render().$el.appendTo(target);
		}, this);
	}
});

setTimeout(function(){
		var myThumbnails = new Thumbnails({'id': 'thumbnails'},{url:"http://eservices.defaceit.ru/variable/pack_json/thumbnails.test.babywonder.ru"}),
			myScripts = new Scripts({'id': 'scripts'},{url:"http://eservices.defaceit.ru/variable/pack_json/scripts.test.defaceit.ru"}),
			myArticle = new Article({'id':'article.test.babywonder.ru'}),
			template = new Defaceit.Model({id: "edit_page_widget.template.defaceit.ru"});

		new Defaceit.Loader([myArticle, myScripts, myThumbnails, template]).on('done', 
			function(){

				Defaceit.Global = new BlocksListView({model: template});
				
				Defaceit.Global
					.set_data([
							[myArticle, ArticleListView, '#articles'],
							[myThumbnails, ThumbnailsView, '#thumbnails'],
							[myScripts, ScriptsListView, '#scripts']
					])
					.render();
				
			});

}, 100);







})();




