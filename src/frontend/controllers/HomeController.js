// HomeController.js
'use strict';

angular.module('app.home', ['ngRoute'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/', {
		controller: 'HomeController',
		templateUrl: 'views/HomeView.html'
	});
}])

// Controller definition for this module
.controller('HomeController', ['$rootScope', '$scope', '$log', HomeMediator]);