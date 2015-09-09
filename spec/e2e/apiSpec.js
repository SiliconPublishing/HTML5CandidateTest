'use strict';

var request = require('request');
var Server = require('../../src/backend/server.js').Server;

describe('The API', function () {

  var server;

  beforeEach(function (done) {
    server = Server('8081');
    server.listen(function (err) { 
        done(err);
    });
  });

  afterEach(function (done) {
    server.close(function () { 
        done();
    });
  });


  it('should access manifest.xml from a GET request at /api/manifest/ and LayoutBookMap.DTDVersion should be 2.8.0', function () {
	   request.get(
          {
            'url': 'http://localhost:8080/api/manifest/',
            'json': true
          },
          function (err, res, body) {
            expect(res.statusCode).toBe(200);
			       console.log(body);
            expect(body.LayoutBookMap.$.DTDVersion).toBe("2.8.0");
             expect(body.LayoutBookMap.$.assetSource).toBeDefined();
            done();
          }
        );
	 
  });

 it('should access manifest.xml from a GET request at /api/manifest/ and assetSource.assetSource should be defined', function () {
     request.get(
          {
            'url': 'http://localhost:8080/api/manifest/',
            'json': true
          },
          function (err, res, body) {
            expect(res.statusCode).toBe(200);
             console.log(body);
             expect(body.LayoutBookMap.$.assetSource).toBeDefined();
            done();
          }
        );
   
  });

  it('should access layout_1.xml from a GET request at /api/layout/ and template DTDVersion is 2.8.0', function () {
	   request.get(
          {
            'url': 'http://localhost:8080/api/layout/',
            'json': true
          },
          function (err, res, body) {
            expect(res.statusCode).toBe(200);
			       console.log(body);
            expect(body.Template.$.DTDVersion).toBe("2.8.0");
            done();
          }
        );

  });

});