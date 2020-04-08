function parseJSON(json){
	let parsedJSON={};
	for(let k in json){
		if(k !== ""){
			let msgId = json[k]["msgid"],
			msgStr = json[k]["msgstr"][0];
			parsedJSON[msgId] = msgStr;
		}
	}
	return parsedJSON
}

/*function toUnicode(theString) {
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode;
    }
    theUnicode = '\\u' + theUnicode;
    unicodeString += theUnicode;
  }
  return unicodeString;
}*/

module.exports={
	parseJSON:parseJSON
}