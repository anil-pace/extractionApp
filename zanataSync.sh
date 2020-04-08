#!/usr/bin/env bash
#converting js to .pot
xgettext --from-code=UTF-8 src/assets/js/serverMessages/*.js -L JavaScript -j -o src/assets/js/utils/vendor/i18n/translation-template_v1.pot;


#Zanata Sync process
zanata-cli -B push;
zanata-cli -B pull;
node translationUtils/po2json2js.js;
git add src/
git commit -m 'BSS-6765 Commit from Jenkins Job' ;
