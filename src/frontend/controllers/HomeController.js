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
.controller('HomeController', ['$rootScope', '$scope', '$log', function($rootScope, $scope, $log) {

	
	var restService = $rootScope.restService;
	$scope.loadLayoutLinks = "";
	$scope.title;
	$scope.json = {object:{}};
	
	
	$scope.$watch('json.string', function (newVal, oldVal) {
			if (newVal !== oldVal) {
				try {
					$scope.error = null;
					$scope.json.object = JSON.parse(newVal);
				} catch (e) {
					console.log(e);
					$scope.error = {
						message: e.message,
						show: true
					}
				}
			}
		});
		
	$scope.getManifest = function(file){
		//TODO: first parameter should be dinamyc
		restService.getManifest("manifest.xml", onGetManifest);
		angular.element("#preloader").show();
	}
	
	function onGetManifest(data){
		//capture layoutRefs..LayoutRef.assetSource to load layouts		
		var list = data.LayoutBookMap.layoutRefs.LayoutRef;
		var links = [];
		//only one page
		if(!list.length) links.push(data.LayoutBookMap.layoutRefs.LayoutRef.assetSource)
		//multiple pages
		for(var i=0; i<list.length; i++){
			var source = data.LayoutBookMap.layoutRefs.LayoutRef[i].assetSource;
			links.push(source);
		}
		$scope.loadLayoutLinks = links;
		angular.element("#preloader").hide();
	}
	
	$scope.getLayout = function(layout){
		var file = layout.replace("\\", "/");
		$scope.title = "File "+file;
		restService.getLayout(file, onGetLayout);
		angular.element("#preloader").show();
	};
	
	function onGetLayout(data){
		$scope.json.string = JSON.stringify(data, null, 2);
		//$log.log($scope.json.string);
		$scope.json.object = $scope.json.string;
		angular.element("#preloader").hide();
		angular.element("#tree").show();
	};
	
}]);