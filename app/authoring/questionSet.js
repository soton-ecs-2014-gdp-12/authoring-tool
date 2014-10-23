'use strict';

angular.module('authoringTool.authoring.questionSet', ['ngRoute','authoringTool.authoring.questionSet.questionBlock','authoringTool.authoring.questionSet.pollBlock','authoringTool.authoring.questionSet.timeChoose'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/authoring', {
    templateUrl: 'authoring/authoring.html',
    controller: 'AccordionCtrl'
  });
}])

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

.directive('questionSet', function(){
	return{
		restrict: 'E',
    	templateUrl: 'authoring/questionSet.html',
		scope: {
    	  heading: '@'
		},
	};
});

angular.module('authoringTool.authoring.questionSet.questionBlock',[])
.directive('questionBlock', function(){
	return{
		restrict: 'E',
    	templateUrl: 'authoring/questionBlock.html',
		scope: {
    	  heading: '@'
		},
	};
});

angular.module('authoringTool.authoring.questionSet.pollBlock',[])
.directive('pollBlock', function(){
	return{
		restrict: 'E',
    	templateUrl: 'authoring/pollBlock.html',
		scope: {
    	  heading: '@'
		},
	};
});

angular.module('authoringTool.authoring.questionSet.timeChoose',[])
.directive('timeChoose', function(){
	return{
		restrict: 'E',
		templateUrl: 'authoring/timeChoose.html'
	};
});
