(function() {
'use strict';

// authoring
angular.module('authoringTool.authoring', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/authoring', {
		templateUrl: 'authoring/authoring.html',
		controller: 'MainCtrl'
	});
}])

.controller('MainCtrl', function ($scope, $rootScope) {

	$scope.data = {
		test: {},
		global: {
			quiz: {
				alwaysSkippable: false,
				skippableOnceCorrect: false,
				showCorrectAnswerWhenSubmitted: false
			},
			polls: {
				showResponsesWhen: "afterEach",
				pollsAlwaysSkippable: false
			}
		}
	};

	$scope.exportBtn = function() {
		console.log($scope.data);
	};

})

.controller('AccordionCtrl', function ($scope) {
	$scope.oneAtATime = true;

	$scope.status = {
		isFirstOpen: true,
		isFirstDisabled: false
	};

	/* Kept as possibly useful code later
	$scope.checkboxes = {};

	$scope.$watch('checkboxes', function(newVal, oldVal) {
		console.log("changed");
		console.log(newVal);
		$scope.setGlobalData("questionsSkippable", newVal);
	});
	*/

})

.controller('AuthoringVideoCtrl', function($scope, $sce) {
	$scope.config = {
		autoHide: false,
		autoHideTime: 3000,
		sources: [
			{
				src: $sce.trustAsResourceUrl("caesar-cipher.mp4"), type: "video/mp4"
			}
		],
		theme: {
			url: "authoring/videogular.css"
		},
		plugins: {
			cuepoints: {
				theme: {
					url: "bower_components/videogular-cuepoints/cuepoints.css",
				}
			}
		}
	};
})

.controller('SetAddCtrl',  function ($scope){
	$scope.sets = ['Question Set 1'];

	$scope.addQuestionSet = function() {
		var newSetNo = $scope.sets.length + 1;
		$scope.sets.push('Question Set ' + newSetNo);
	};
})

.directive('defaultOptionsBlock', function(){
	return {
		restrict: 'E',
		templateUrl: 'authoring/defaultOptions.html'
	};
})

.directive('questionOptionsBlock', function(){
	return {
		restrict: 'E',
		templateUrl: 'authoring/defaultOptions.html',
		scope: {
			heading: '@'
		}
	};
})

.controller('SectionAddCtrl',  function ($scope){
	$scope.questions = [
		{
			name:'Question 1',
			type:'quiz'
		}
	];

	var pollNo = 1;
	var quizNo = 2;

	$scope.addPoll = function() {
		pollNo = pollNo + 1;

		return $scope.questions.push({
			name:'Poll ' + pollNo,
			type:'poll'
		});
	};

	$scope.addQuestion = function() {
		quizNo = quizNo + 1;
		return $scope.questions.push({name:'Question ' + quizNo, type:'quiz'});
	};

	Array.prototype.swap = function (x,y) {
		var b = this[x];
		this[x] = this[y];
		this[y] = b;
		return this;
	};

	Array.prototype.getIndexByVal = function (toGet) {
		var index = -1;
		for (var i = 0, len = this.length; i < len; i++) {
			if (this[i].name === toGet.name) index=i;
		}
		return index;
	};

	$scope.moveQuestionUp = function(event,toMove) {
		event.preventDefault();
		event.stopPropagation();

		var index = $scope.questions.getIndexByVal(toMove);
		console.dir(index);
		if (index > 0){
			$scope.questions.swap(index, index-1);
		}
		console.dir($scope.questions);
	};

	$scope.moveQuestionDown = function(event,toMove) {
		event.preventDefault();
		event.stopPropagation();

		var index = $scope.questions.getIndexByVal(toMove);
		console.dir(index);
		if (index > 0){
			$scope.questions.swap(index, index+1);
		}
		console.dir($scope.questions);
	};
})

.directive('questionSet', function(){
	return {
		restrict: 'E',
		templateUrl: 'authoring/questionSet.html',
		scope: {
			heading: '@'
		}
	};

/* This is an insanely useful directive, prints the current scope, use it in place of batarang as it mainly fails */
.directive('debugScopeButton', function() {
	return {
		restrict: 'E',
		template: '<button type="button" class="btn  btn-warning btn-xs" ng-click="debugScope()">debug scope</button>',
		scope: {
			toEcho: "=toEcho"
		},
		controller: ['$scope', function($scope) {
			$scope.debugScope = function() {
				console.log($scope.toEcho);
			};
		}]
	}
})

.directive('questionBlock', function(){
	return {
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
})

.directive('timeChoose', function(){
	return {
		restrict: 'E',
		require: '^questionSet',
		templateUrl: 'authoring/timeChoose.html'
	};
})

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

	$scope.addAnswer = function(newAnswer) {
		if (newAnswer.length>0) {
			if ($scope.answers.indexOf(newAnswer)==-1){
				$scope.answers.push(newAnswer);
			}
		}
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

	$scope.setCorrect = function (toSet) {
		$scope.correct = toSet;
	}
})

.directive('stars', function(){
	return {
		restrict: 'E',
		require: '^questionBlock',
		templateUrl: 'authoring/answerPanel/stars.html'
	};
});

function questionAnsweredIncorrectly(questionId, time) {

	var template = '{\
		id: "incorrect-QUESTION_ID",\
		type: "single",\
		question: "Answer incorrect, do you want to review the video",\
		options: [\
			{\
				name: "Yes"\
			},\
			{\
				name: "No"\
			}\
		],\
		action: function(questions, video) {\
			var question = questions.get("QUESTION_ID");\
			if (question.response !== question.correctAnswer) {\
				video.setTime(TIME);\
			}\
		},\
		condition: function(questions) {\
			return questions.get("QUESTION_ID").isNotCorrect();\
		}\
	}';

	template.replace(/QUESTION_ID/g, questionId);
	template.replace(/TIME/g, time);

	return template;
}

function exportWebWorker(data) {

}

})();
