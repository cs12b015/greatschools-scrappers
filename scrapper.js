var fs = require('fs');
var stringify = require('csv-stringify');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');

var MAINURL="http://www.greatschools.org/";


request(MAINURL, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	$ = cheerio.load(body);

  	var boss= $('.row.tal.mbl.limit-width-1200').find('a').attr('href');
  	console.log(boss);
    //console.log(body);
  }
})







/*var getStatesUrl=function(url){
	console.log('fetching from ' + url);
	request(url, function(error, res, body) {
		if(error) console.error(error); //cb(err);
		var $ = cheerio.load(body, {
			normalizeWhitespace: true,
			xmlMode: false,
			decodeEntities: true
		});
		console.log(body);
		//getDataUrl($, function(err, data){
			//if(err) cb(err);
			// appendToFile(data);
		
		//});
	});
};
getStatesUrl(MAINURL,function(err){
//console.log(data);
});*/