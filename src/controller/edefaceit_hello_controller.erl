-module(edefaceit_hello_controller, [Req]).
-compile(export_all).

lost(Get, []) ->
	{ok, Result} = parse(Req:uri()),

	Action = proplists:get_value(action, Result, default),

	case Action of
		editme ->
			{redirect, "/app/edit/" ++ application_name(Result)};
		default ->
			app_render(Result)
	end.
	

parse(Url) ->
	case re:split(Url, "/", [{return, list}]) of
		[_Empty,App] ->
			{ok, [{app, App}, {action, default}]};

		[_Empty, App, "edit"] ->
			{ok, [{app, App}, {action, editme}]};

		[_Empty, App|_] ->
			{ok, [{app, App}, {action, default}]};

		[] ->
			{error, empty_url};

		_ -> 
			{error, unknown_url_parse_error}
	end.


app_render(Info) ->
	Owner = defaceit:get_owner_script_for(application_name(Info)),
	
	case Owner of
		[]  ->
			{output, application_name(Info)};
			%{redirect, "/app/edit/" ++ application_name(Info)};
		[OwnerData] ->
			Referent = defaceit:get_referent_script_for(application_name(Info)),
			ActiveReferent = defaceit:get_active_referent_script_for(Referent,  Req:header(referer)),
			app_page(application_name(Info),[{owner, OwnerData}, {referents, Referent}, {active_referent, ActiveReferent}]);
		_ ->
			{redirect, "/"}
	end.

app_page(PageName, Attrs)->
  case boss_db:find_first(page, [pagename, 'equals', PageName]) of
    undefined ->
	{ok, Attrs};
    Page ->
	{_,_,_,Content} = Page,
	erlydtl:compile_template(http_uri:decode(binary_to_list(Content)), my_module_name),
	{ok, RenderedContent} = my_module_name:render(Attrs),
	{output, RenderedContent}
end.

application_name([{app, App}|_]) -> App.

