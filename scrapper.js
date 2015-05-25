var fs = require('fs');
var stringify = require('csv-stringify');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');

var MAINURL="http://www.greatschools.org/";


request(MAINURL, function (error, response, body) 
{
  	if (!error && response.statusCode == 200) 
  	{
  		var links =[];
	  	$ = cheerio.load(body);
	  	$('.row.tal.mbl.limit-width-1200').find('a').each(function(index,item) 
	  	{
		  	var boss= $(item).attr('href');
		  	links[index]=boss+"schools/?page=1";
		  	//console.log(links[index]);
		});
		console.log("got links");
		dothething(links);
	}
});

var dothething= function(links){
	var linksize = links.length;
	// for(var i=0;i<linksize;i++){
	for(var i=0;i<1;i++){
		var lastpagenumb;
		request(links[i],function(error, response, body){
			if (!error && response.statusCode == 200) 
		  	{
			  	$ = cheerio.load(body);
			  	var list = $('.pagination.page.js-no_ad a');
			  	//var temp = $(list[list.length-1]);
			  	var temp1 = $(list.find('a').text());
			  	// console.log(temp);
			  	console.log(temp1);
			}
		});
	}
}