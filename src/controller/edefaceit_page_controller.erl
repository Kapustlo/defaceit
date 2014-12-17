-module(edefaceit_page_controller, [Req]).
-compile(export_all).


index(Get, [])->
    {output, "Application page"}.
    
content(Get, [])->
    {redirect,"/page"};
content(Get, [PageName]) ->
    case boss_db:find_first(page, [pagename, 'equals', PageName]) of
	undefined ->
	    {redirect, "/page/create/" ++ PageName};
	Message ->
	    {_,_,_,Content} = Message,
	     
	    {output, http_uri:decode(binary_to_list(Content))}
	    %{ok, [{messages, Message}]}
    end.


create(Get, [Title]) ->
    {ok, [{title, Title}, {'pageName', "{{pageName}}"}]}.


publish(Post, [PageName]) ->
	Content = Req:post_param("content"),
	%ContentScript = re:replace(Content, "<!--DefaultValues-->", "<script>" ++ v("Defaceit.Page.type", Type) ++ v("Defaceit.Page.name", Title) ++ v("Defaceit.Page.namespace", Site)++ v("url", Url) ++ "</script>", [global, {return, list}]),
	drop_by(PageName),
	NewPage = page:new(id, PageName, http_uri:encode(Content)),
	{ok, Saved} = NewPage:save(),
	{output, "page added to defaceit"}.

v(N,V) ->
	N ++ " = '" ++ V ++ "';".

drop_by(PageName) ->
    case boss_db:find(page, [pagename, 'equals', PageName]) of
	[] ->
          {ok, "nothing to do"};
        [Message] ->
    	    boss_db:delete(Message:id())
    end.


list(Get, [Site]) ->
case boss_db:find(page, [site, 'equals', Site]) of
	[] ->
	    {output, "Empty list"};	
	Articles ->
	    {ok, [{articles, Articles}]}
end.
    