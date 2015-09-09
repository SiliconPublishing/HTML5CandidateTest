'use strict';

// simple stub that could use a lot of work...
app.factory('RESTService',
    function ($http, $rootScope) {
		var domain = "http://localhost:8080";
        return {
			//general purpose call, not actually in use, for loading any file upon request
			get:function (url, callback) {
                return $http({method:'GET', url:url}).
                    success(function (data, status, headers, config) {	
						    callback(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log("failed to retrieve data");
                    });
            },
			//TODO: use id paramter to point to some manifest filename
            getManifest:function (id, callback) {
			    return  $http({
     			  	    url: domain+'/api/manifest?'+id,
        				method: "GET"
    				}).
                    success(function (data, status, headers, config) {
						    callback(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log("failed to retrieve manifest");
                    });
            },
			//TODO: use id parameter to point to some layout filename
			 getLayout:function(id, callback) {
                return  $http({
     			  	    url: domain+'/api/layout?file='+id,
        				method: "GET"
    				}).
                    success(function (data, status, headers, config) {
						    callback(data);
                    }).
                    error(function (data, status, headers, config) {
                        console.log("failed to retrieve layout");
                    });
            }
        };
    }
);