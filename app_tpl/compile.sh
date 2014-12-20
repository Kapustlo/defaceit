#!/bin/bash

JS_DEF_DIR={{defaceit_src}}
JS_DEF_PROJECT_DIR=$JS_DEF_DIR/{{appid}}
JS_TPL=`find ./templates -type f \( -name '*.js' \)`

java -jar /home/sal/app/closure/compiler.jar --js \
$JS_DEF_DIR/tools.js \
$JS_DEF_PROJECT_DIR/develop/{{appid}}.js \
$JS_TPL \
--js_output_file $JS_DEF_PROJECT_DIR/{{appid}}.js

php ~/pub.php develop/main.html
