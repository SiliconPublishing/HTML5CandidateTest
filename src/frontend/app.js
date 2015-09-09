'use strict';


     var   app   =  angular.module('app',  ['ngRoute',  'angular-json-tree', 'app.home']);

     app.config(function($routeProvider) {
      
             	// Declaration of the default route ... we don't need much more on this simple example
				$routeProvider.otherwise({ redirectTo: '/'});

          });

		app.run(function ($rootScope, RESTService) {
			 $rootScope.restService = RESTService;
		});



