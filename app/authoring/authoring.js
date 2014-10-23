'use strict';

angular.module('authoringTool.authoring', ['ngRoute','authoringTool.authoring.defaultOptionsBlock','authoringTool.authoring.questionBlock','authoringTool.authoring.pollBlock','authoringTool.authoring.timeChoose'])
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
})

.controller('SectionAddCtrl',  function ($scope){
	$scope.polls = ['Poll 1'];
	$scope.questions = ['Question 1', 'Question 2'];

	$scope.addPoll = function() {
   		var newPollNo = $scope.polls.length + 1;
    	$scope.polls.push('Poll ' + newPollNo)
  	};
	
	$scope.addQuestion = function() {
   		var newQuestionNo = $scope.questions.length + 1;
    	$scope.questions.push('Question ' + newQuestionNo)
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

angular.module('authoringTool.authoring.questionBlock',[])
.directive('questionBlock', function(){
	return{
		restrict: 'E',
    	templateUrl: 'authoring/questionBlock.html',
		scope: {
    	  heading: '@'
		},
	};
});

angular.module('authoringTool.authoring.pollBlock',[])
.directive('pollBlock', function(){
	return{
		restrict: 'E',
    	templateUrl: 'authoring/pollBlock.html',
		scope: {
    	  heading: '@'
		},
	};
});

angular.module('authoringTool.authoring.timeChoose',[])
.directive('timeChoose', function(){
	return{
		restrict: 'E',
		templateUrl: 'authoring/timeChoose.html'
	};
});
