'use strict';

angular.module('authoringTool.authoring', ['ngRoute','authoringTool.authoring.defaultOptionsBlock'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/authoring', {
    templateUrl: 'authoring/authoring.html',
    controller: 'AccordionCtrl'
  });
}])

.controller('AccordionCtrl', function ($scope) {
  $scope.oneAtATime = true;

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
})

.controller('AuthoringVideoCtrl', function($scope, $sce) {
	$scope.config = {
		autoHide: false,
		autoHideTime: 3000,
		sources: [
			{src: $sce.trustAsResourceUrl("caesar-cipher.mp4"), type: "video/mp4"},
		],
		theme: {
			url: "authoring/videogular.css"
		},
		plugins: {
			questions: {
				theme: {
					url: "authoring/videogular-questions.css"
				},
				data:{
					url: "authoring/caesar-test.js",
				}
			},
			cuepoints: {
				theme: {
					url: "bower_components/videogular-cuepoints/cuepoints.css",
				},
			},
		}
	};
});

angular.module('authoringTool.authoring.defaultOptionsBlock',[])
.directive('defaultOptionsBlock', function(){
	return{
		restrict: 'E',
    	templateUrl: 'authoring/defaultOptions.html',
		scope: {
    	  heading: '@'
		},
	};
});

