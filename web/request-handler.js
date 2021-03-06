var path = require('path');
var fs = require('fs');
var queryString = require('querystring');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  //----- Initialize Variables -----
  var mimeTypes = {
    '.js' : 'text/javascript',
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.gif' : 'image/gif',
    '.ico' : 'image/vnd.microsoft.icon',
    '.txt' : 'text/plain'
  };

  if (req.url === '/'){
    req.url += 'index.html';
  }

  // Get filetype
  var ext = path.extname(req.url);
  var mime = {
    'Content-Type': mimeTypes[ext] || mimeTypes['txt']
  };
  //----- End Initialize Variables -----

  //----- GET request -----
  if(req.method === 'GET'){
    fs.exists(archive.paths.siteAssets + req.url, function(exists){
      if(exists){
        fs.readFile(archive.paths.siteAssets + req.url, function(err, data){
          if(err) {
            res.writeHead(500, mime);
            res.end('File not found');
          } else{
            res.writeHead(200, mime);
            res.end(data);
          }
        });
      }else{
        archive.isURLArchived(req.url, function(exists){
          if(exists){
            fs.readFile(archive.paths.archivedSites + req.url, function(err, data){
              if(err) {
                res.writeHead(500, mime);
                res.end('File not found');
              }else{
                res.writeHead(200, mime);
                res.end(data);
              }
            });
          }else{
            res.writeHead(404, mime);
            res.end('File not found');
          }
        })
      }
    });
  }//----- End GET Request -----

  if(req.method === 'POST'){
    console.log("POST");
    if(req.url === '/index.html'){
      req.on('data', function(data){
        var newData = queryString.parse(data.toString('utf-8'));
        archive.addUrlToList(newData.url);

        archive.isURLArchived(newData.url, function(exists){
          console.log(exists);
          if(exists){
            res.writeHead(302, {'location': '/' + newData.url});
          }else{
            res.writeHead(302, {'location': 'loading.html'});
          }
          res.end();
        });
      });
    }

  }

  // res.end(archive.paths.list);

};
