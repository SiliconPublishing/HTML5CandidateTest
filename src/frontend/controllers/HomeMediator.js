function HomeMediator($rootScope, $scope, $log){
	this.restService = $rootScope.restService;
	this.scope = $scope; //reference to scope to be used in the class
	$scope.ref = this; //self reference attached to the scope
	this.init($scope);
}

HomeMediator.prototype.init = function( $scope ){
	
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
		this.restService.getManifest("manifest.xml", angular.bind(this.ref, this.ref.onGetManifest));
		angular.element("#preloader").show();
	}

	$scope.getLayout = function(layout){
		var file = layout.replace("\\", "/");
		$scope.title = "File "+file;
		this.restService.getLayout(file, angular.bind(this.ref, this.ref.onGetLayout));
		angular.element("#preloader").show();
	};
}

HomeMediator.prototype.onGetManifest = function(data){
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
	this.scope.loadLayoutLinks = links;
	angular.element("#preloader").hide();
}

HomeMediator.prototype.onGetLayout = function(data){
	this.scope.json.string = JSON.stringify(data, null, 2);
	//$log.log($scope.json.string);
	this.scope.json.object = this.scope.json.string;
	angular.element("#preloader").hide();
	angular.element("#tree").show();
};

HomeMediator.prototype.newInstance = function( $rootScope, $scope, $log ){
    return new HomeMediator($rootScope, $scope, $log);
}


