#!/bin/bash

JS_DEF_DIR=/home/sal/development/edefaceit/priv/static/defaceit
JS_DEF_PROJECT_DIR=$JS_DEF_DIR/tools

java -jar /home/sal/app/closure/compiler.jar --js \
$JS_DEF_PROJECT_DIR/lib/jquery.min.js \
$JS_DEF_PROJECT_DIR/lib/underscore.js \
$JS_DEF_PROJECT_DIR/lib/backbone.js \
$JS_DEF_PROJECT_DIR/develop/defaceit.js \
$JS_DEF_PROJECT_DIR/develop/mvcdef.js \
$JS_DEF_PROJECT_DIR/develop/request.js \
$JS_DEF_PROJECT_DIR/develop/screen.js \
$JS_DEF_PROJECT_DIR/develop/session.js \
$JS_DEF_PROJECT_DIR/develop/display.js \
$JS_DEF_PROJECT_DIR/develop/window.js \
$JS_DEF_PROJECT_DIR/develop/queue.js \
$JS_DEF_PROJECT_DIR/develop/variable.js \
$JS_DEF_PROJECT_DIR/develop/wizard.js \
$JS_DEF_PROJECT_DIR/develop/template.js \
$JS_DEF_PROJECT_DIR/develop/load.js \
$JS_DEF_PROJECT_DIR/develop/loader.js \
$JS_DEF_PROJECT_DIR/develop/cli.js \
--js_output_file $JS_DEF_PROJECT_DIR/../tools.js



