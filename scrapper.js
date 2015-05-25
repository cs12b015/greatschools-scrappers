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
});