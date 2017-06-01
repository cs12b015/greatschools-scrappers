/**
 * Scrapper for greatschools.org
 * @author Jayanth<jayanthk19@gmail.com>
 */

var fs = require('fs');
var stringify = require('csv-stringify');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');

var mainnumbproc = parseInt(process.argv[2])

var MAINURL="http://www.greatschools.org/schools/cities/Alabama/AL/";
var links=[];

request(MAINURL, function (error, response, body)
{
  	if (!error && response.statusCode == 200)
  	{
	  	$ = cheerio.load(body);
	  	$("#dropdown_menu option").each(function()
		{
			links.push("http://www.greatschools.org"+$(this).val())
		});
		links[1] = "http://www.greatschools.org/schools/cities/Alabama/AL/";
		console.log("collected the links");
		dothething(links);
	}
});

//count the page numbers and calls the urls
var dothething= function(links){
	var linksize = links.length;
	for(var i=0;i<linksize;i++){
		var pasturl=links[i];
		fetch_city(pasturl);
	}
};

var setFetch =function(url,time){
	setTimeout(function(){
		fetch(url);
	}, time)
}


var fetch_city = function(reqUrl){
	request(reqUrl, function (error, response, body)
	{
	  	if (!error && response.statusCode == 200)
	  	{
		  	$ = cheerio.load(body);
		  	var arr =$(".city-district-link a");
		  	for(var i=0;i<arr.length;i++){
		  		var feturl = arr[i].attribs.href+"schools/?page=";
		  		var timeouttime =2*i*1000;
		  		setFetch(feturl,timeouttime);
		  	}
		}
	});
}



//8000038220
var fetch = function(pasturl){
	var statedata=[];
	var lastpagenumb;
	var filename="";
	var currenturl=pasturl +"1";
	request(currenturl,function(error, response, body){
		if (!error && response.statusCode == 200)
	  	{
		  	$ = cheerio.load(body);
		  	var list = $('.pagination .page .js-no_ad');
			var numbstring = $(list[list.length-1]).text();
			lastpagenumb=parseInt(numbstring);
			if(lastpagenumb){
				var filnamarr1=pasturl.split('/');
				var filename1=filnamarr1[3]+"-"+filnamarr1[4];
				writeToFile(filnamarr1[3],filename1,"name,address,review,district,grade\n");

				console.log("max page numbers:- "+lastpagenumb);
				for(var j=0;j<lastpagenumb;j++){
					var strignumb=(j+1).toString();
					var presentlink = pasturl+strignumb;
					GetDetails(presentlink,function(err,data,pasturl){
						if(err)
							throw err;
						else
						{
							var filnamarr=pasturl.split('/');
							filename=filnamarr[3]+"-"+filnamarr[4];
							statedata=statedata.concat(data);
							var pagnunmb=filnamarr[filnamarr.length-1].split('?');
							console.log("Writing the "+filename+" "+pagnunmb[1]+" to "+filename+".csv file");
							writeToFile(filnamarr[3],filename,data);
						}
					});

				}
				
			}else{
				var filnamarr2=pasturl.split('/');
				var filename2=filnamarr2[3]+"-"+filnamarr2[4];
				writeToFile(filnamarr2[3],filename2,"name,address,review,district,grade\n");
				GetExistingDetails(currenturl,body,function(err,data,pasturl){
					if(err)
						throw err;
					else
					{
						var filnamarr=pasturl.split('/');
						filename=filnamarr[3]+"-"+filnamarr[4];
						statedata=statedata.concat(data);
						var pagnunmb=filnamarr[filnamarr.length-1].split('?');
						console.log("Writing the "+filename+" "+pagnunmb[1]+" to "+filename+".csv file");
						writeToFile(filnamarr[3],filename,data);
					}
				});
				
			}
		}
	});
};

var GetExistingDetails = function(url,body,cb){
	
		var school = [];

  	$ = cheerio.load(body);
  	$('.js-schoolSearchResult.js-schoolSearchResultCompareErrorMessage').each(function(index, item) {
  		var schoolData = {};
  		var name=$(item).find('.open-sans_sb.mbs.font-size-medium.rs-schoolName').text();
  		var address=$(item).find('.hidden-xs.font-size-small.rs-schoolAddress').text();
  		var tempreview=$(item).find('.font-size-small.js-reviewCount').text();
  		var revarr=tempreview.split(" ");
  		var reviewnumb=revarr[0];
  		var district=$(item).find('.font-size-small.mvm.clearfix.ptm.hidden-xs .prs.fl').text();
  		var grade=$(item).find('.font-size-small.mvm.clearfix.ptm.hidden-xs .fl:nth-child(4)').text()

  		schoolData = {
  			name: name,
  			address: address,
  			review: reviewnumb,
  			district: district,
  			grade: grade
  		};
  		school.push(schoolData);
  	});
  	cb(null,school,url);

};


var GetDetails = function(url,cb){
	request(url,function(error, response, body){
		if (!error && response.statusCode == 200)
	  	{
	  		var school = [];

		  	$ = cheerio.load(body);
		  	$('.js-schoolSearchResult.js-schoolSearchResultCompareErrorMessage').each(function(index, item) {
		  		var schoolData = {};
		  		var name=$(item).find('.open-sans_sb.mbs.font-size-medium.rs-schoolName').text();
		  		var address=$(item).find('.hidden-xs.font-size-small.rs-schoolAddress').text();
		  		var tempreview=$(item).find('.font-size-small.js-reviewCount').text();
		  		var revarr=tempreview.split(" ");
		  		var reviewnumb=revarr[0];
		  		var district=$(item).find('.font-size-small.mvm.clearfix.ptm.hidden-xs .prs.fl').text();
		  		var grade=$(item).find('.font-size-small.mvm.clearfix.ptm.hidden-xs .fl:nth-child(4)').text()

		  		schoolData = {
		  			name: name,
		  			address: address,
		  			review: reviewnumb,
		  			district: district,
		  			grade: grade
		  		};
		  		school.push(schoolData);
		  	});
		  	cb(null,school,url);
		}
	});
};

// converts given array to csv and add it to file
var writeToFile = function(stateName,filename, list) {
	var File = './'+stateName+"/" + filename + '.csv';
	var dir = './'+stateName;
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}
	var content = stringify(list, {header: false}, function(err, output){
		fs.appendFileSync(File, output, {encoding: 'utf8'});
	});
}