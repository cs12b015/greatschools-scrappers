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
		  	links[index]=boss+"schools/?page=";
		  	console.log(links[index]);
		});
		console.log("got links");
		
	}
});