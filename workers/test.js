// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.


var archives = require('../helpers/archive-helpers');
var http = require('http-request');
var fs = require('fs');


fs.readdir(archives.paths.archivedSites, function(err, files){
  console.log(files);
});
