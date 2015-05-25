var fs = require('fs');
var stringify = require('csv-stringify');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');

var MAINURL="http://www.greatschools.org/";
var totallinks=[];
var links=[];

request(MAINURL, function (error, response, body)
{
  	if (!error && response.statusCode == 200)
  	{
  		//var links =[];
	  	$ = cheerio.load(body);
	  	$('.row.tal.mbl.limit-width-1200').find('a').each(function(index,item)
	  	{
		  	var boss= $(item).attr('href');
		  	links[index]=boss+"schools/?page=";
		  	//console.log(links[index]);
		});
		console.log("got links");
		dothething(links);
		console.log(totallinks);
	}
});
//count the page numbers and calls the urls
var dothething= function(links){
	var linksize = links.length;
	for(var i=0;i<linksize;i++){
		var pasturl=links[i];
		console.log(pasturl);
		fetch(pasturl);
	}
};

var fetch = function(pasturl){
	var lastpagenumb;
	var currenturl=pasturl +"1";
	request(currenturl,function(error, response, body){
		if (!error && response.statusCode == 200)
	  	{
		  	$ = cheerio.load(body);
		  	var list = $('.pagination .page .js-no_ad');
			var numbstring = $(list[list.length-1]).text();
			lastpagenumb=parseInt(numbstring);
			console.log(lastpagenumb);
			var totalsize = totallinks.length;
			for(var j=0;j<lastpagenumb;j++){
				var strignumb=(j+1).toString();
				totallinks[totalsize+j]=pasturl+strignumb;
				console.log(totallinks[totalsize+j]);
			}
		}
	});
};
