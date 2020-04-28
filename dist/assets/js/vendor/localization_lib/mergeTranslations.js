/**
 * This node js util is to find out the missing translations in different languages
 * which 
 * @type {[type]}
 */
var fs = require('fs');
var enTranslationMessages =require ('../i18n/english.json');
const MESSAGES_PATTERN='../i18n/**/*.json';
const LANG_DIR       ='../i18n/';
const MISSING_TRANS_DIR = LANG_DIR+'missing/';

fs.readdir(LANG_DIR,(err, files)=>{
	for (let x=0;x<files.length;x++){
		let aMissedTranslations=[];
		console.log('Translation files found:'+files[x]);
		console.log('Reading the translation files');
		if (files[x].match(/.json/g) && !files[x].match(/english.json/g)){
			fs.readFile(LANG_DIR+files[x], (err, data) => {
				if (err) throw err;
				// since enTranslationMessages is the base for all translations
				// so comparing the others with the base and finding the difference
				let objTranslations = JSON.parse(data);
				for (let engMsg in enTranslationMessages){
					console.log('Comparing the translations now:'+engMsg.key);
					let bMissingTranslation = true;
					for (let obj in  objTranslations){	
						if (obj===engMsg){
							bMissingTranslation = false;
							break ;
						}
					}
					if (bMissingTranslation){
						aMissedTranslations.push(JSON.stringify(engMsg,null,'\t'));
					}
				}
				let fsText = '[\n'+aMissedTranslations.join (',\n')+'\n]';
				console.log('Number of missing translations in:'+files[x]+ aMissedTranslations.length);
				fs.writeFile(MISSING_TRANS_DIR+'missing-'+files[x],fsText, (err) => {
					if (err) throw err;
					console.log('Missing Translations Saved for:'+files[x]+
						'in file: '+MISSING_TRANS_DIR+'missing-'+files[x] );
				});
			});
		}
	}
})
