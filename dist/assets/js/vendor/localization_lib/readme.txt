Include Icu.js and translate.js library
Install Po edit software
Create a new catalog
Change source code file text as mentioned in localeplanet lib

Run the command: 
//do not execute xgettext on any file other than english.po 
xgettext --from-code=UTF-8 src/assets/js/serverMessages/*.js -L JavaScript -j -o src/assets/js/utils/vendor/i18n/english.po

Open Po edit and open the chinese.po file and you can see the text extracted from the files

After edit PO file make it json with the comm and

python src/assets/js/utils/vendor/localization_lib/po_to_json.py src/assets/js/utils/vendor/i18n/chinese*.po