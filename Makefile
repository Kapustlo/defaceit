REBAR := ./rebar
PREFIX:=./priv/static/defaceit/
DEST:=$(PREFIX)$(PROJECT)



all: get-deps compile

get-deps:
	$(REBAR) get-deps

compile:
	$(REBAR) compile
	$(REBAR) boss c=compile

app:
	$(REBAR) create template=defaceit src=$(PWD) appid=$(PROJECT) theme=$(THEME) skip_deps=true
