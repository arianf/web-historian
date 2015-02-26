// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.


var archives = require('../helpers/archive-helpers');
var http = require('request');


// open sites list,
// cycle through items in the list
// if list item has been archived
  // dont do anything
// else
  // archives the url
// use callback to call next item on the list
archives.readListOfUrls(function(urls){
  urls.forEach(function(url){
    archives.isURLArchived(url, function(exists){
      if(!exists){
        http.get({
          url: 'http://' + url,
          progress: function (current, total) {
            console.log('downloaded %d bytes from %d', current, total);
          }
        },
        url,
        function(err, res){
          if(err){
            console.error(err);
          }
          console.log(res.code, res.headers, res.file);
        });
      }
    });
  });
});

// http.get({
//   url: 'http://localhost/get',
//   progress: function (current, total) {
//     console.log('downloaded %d bytes from %d', current, total);
//   }
// }, 'get.bin', function (err, res) {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   console.log(res.code, res.headers, res.file);
// });
