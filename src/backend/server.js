'use strict';

var Percolator = require('percolator').Percolator;
var fs = require('fs');
var xml2js = require('xml2js');
var url = require('url') ;

var Server = function(port) {
  var server = Percolator({'port': port, 'autoLink': false, 'staticDir': __dirname + '/../frontend'});

  server.route('/api/manifest',
    {
      GET: function (req, res) {
		  try {
			var filePath = "manifest.xml";
            var fileData = fs.readFileSync(filePath, 'utf8');
			var json;
            var parser = new xml2js.Parser({mergeAttrs:true, explicitArray:false});
            parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
				json = JSON.stringify(result);
				console.log(JSON.stringify(result));
			});

			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(json);
 			res.end();
		} catch (err){
			console.log("Tryng to load File '" + filePath);
			console.log(err);
			res.status.internalServerError(err);
		}
	  }
	});
	
	 server.route('/api/layout',
    {
      GET: function (req, res) {
		  try {
		  	var queryObject = url.parse(req.url,true).query;
  			//console.log(queryObject.file);
			var filePath = queryObject.file;
            var fileData = fs.readFileSync(filePath, 'utf8');
			var json;
            var parser = new xml2js.Parser({mergeAttrs:true, explicitArray:false});
            parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
				json = JSON.stringify(result);
				//console.log(JSON.stringify(result));
			});

			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(json);
 			res.end();
		} catch (err){
			console.log("Tryng to load File '" + filePath);
			console.log(err);
			res.status.internalServerError(err);
		}
	  }
	});
	 
  return server;
};

module.exports = {'Server': Server};