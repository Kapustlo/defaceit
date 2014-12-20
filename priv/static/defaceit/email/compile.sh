#!/bin/bash

JS_DEF_DIR=/home/sal/development/edefaceit/priv/static/defaceit
JS_DEF_PROJECT_DIR=$JS_DEF_DIR/email
JS_TPL=`find ./develop/templates -type f \( -name '*.js' \)`


java -jar /home/sal/app/closure/compiler.jar --js \
$JS_DEF_DIR/tools.js \
$JS_DEF_PROJECT_DIR/develop/email.js \
$JS_TPL \
--js_output_file $JS_DEF_PROJECT_DIR/email.js

cp develop/main.html email.html
php ~/pub.php email.html
