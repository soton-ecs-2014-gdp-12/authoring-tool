'use strict';

angular.module('authoringTool.authoring', ['ngRoute','authoringTool.authoring.defaultOptionsBlock','authoringTool.authoring.questionSet', 'authoringTool.authoring.answerPanel'])
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

.controller('SetAddCtrl',  function ($scope){
	$scope.sets = ['Question Set 1'];

	$scope.addQuestionSet = function() {
   		var newSetNo = $scope.sets.length + 1;
    	$scope.sets.push('Question Set ' + newSetNo)
  	};

})

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

angular.module('authoringTool.authoring.questionSet', ['authoringTool.authoring.questionSet.questionBlock','authoringTool.authoring.questionSet.timeChoose'])

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

})

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
		require: '^questionSet',
    	templateUrl: 'authoring/questionBlock.html',
		scope: {
    		heading: '@',
			type: '@'
		},
		controller: ['$scope', function($scope) {
      		this.getType = function() {
        		return $scope.type;
     	 	}
    	}]
	};
});

angular.module('authoringTool.authoring.questionSet.timeChoose',[])
.directive('timeChoose', function(){
	return{
		restrict: 'E',
		require: '^questionSet',
		templateUrl: 'authoring/timeChoose.html'
	};
});

angular.module('authoringTool.authoring.answerPanel',['authoringTool.authoring.answerPanel.multiple','authoringTool.authoring.answerPanel.stars','authoringTool.authoring.answerPanel.pairs']);

angular.module('authoringTool.authoring.answerPanel.multiple',[])
.directive('multipleChoice', function(){
	return{
		restrict: 'E',
		require: '^questionBlock',
		templateUrl: 'authoring/answerPanel/multipleChoice.html',
		scope: {
			single: '@'
		},
		link: function(scope, element, attrs, ctrl) {
			scope.type = ctrl.getType();
    	}
	};
})

.controller('AddAnswerCtrl',  function ($scope){
	$scope.answers = [];
	$scope.correct = [];

	$scope.addAnswer = function(newAnswer) {
		if ($scope.answers.indexOf(newAnswer)==-1) $scope.answers.push(newAnswer);
  	};

	$scope.removeAnswer = function(toRemove) {
		var index = $scope.answers.indexOf(toRemove);
		if (index > -1) {
    		$scope.answers.splice(index, 1);
		}
	};

	$scope.moveAnswerUp = function(toMove) {
		var index =  $scope.answers.indexOf(toMove);
		if (index > 0){
			var temp = $scope.answers[index - 1];
    		$scope.answers[index - 1] = $scope.answers[index];
    		$scope.answers[index] = temp;
		}
	};

	$scope.moveAnswerDown = function(toMove) {
		var index =  $scope.answers.indexOf(toMove);
		if (index < ($scope.answers.length -1)){
			var temp = $scope.answers[index];
    		$scope.answers[index] = $scope.answers[index + 1];
    		$scope.answers[index + 1] = temp;
		}
	};
});

angular.module('authoringTool.authoring.answerPanel.stars',[])
.directive('stars', function(){
	return{
		restrict: 'E',
		require: '^questionBlock',
		templateUrl: 'authoring/answerPanel/stars.html'
	};
});

angular.module('authoringTool.authoring.answerPanel.pairs',[])
.directive('matchingPairs', function(){
	return{
		restrict: 'E',
		require: '^questionBlock',
		templateUrl: 'authoring/answerPanel/matchingPairs.html'
	};
});
