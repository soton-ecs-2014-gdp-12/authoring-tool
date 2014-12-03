/* jshint browser: true */

(function() {
'use strict';

// authoring
angular.module('authoringTool.authoring', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/authoring', {
		templateUrl: 'authoring/authoring.html',
		controller: 'MainCtrl',
	});
}])

.controller('MainCtrl', function ($scope, $rootScope) {

	$scope.data = {
		questionSet: [],
	};

	$scope.exportBtn = function() {
		console.log($scope.data);

		var data = exportWebWorker($scope.data);

		// URL.createObjectURL
		window.URL = window.URL || window.webkitURL;

		var blob = new Blob([data], {type: 'application/javascript'});

		var url = URL.createObjectURL(blob);

		console.log(url);

		$rootScope.$emit("blob_url", url);

		console.log(data);
	};

})

.controller('AccordionCtrl', function ($scope) {
	$scope.oneAtATime = true;

	$scope.status = {
		isFirstOpen: true,
		isFirstDisabled: false,
	};

})

.controller('AuthoringVideoCtrl', function($scope, $sce, $rootScope) {
	$scope.config = {
		autoHide: false,
		autoHideTime: 3000,
		sources: [
			{
				src: $sce.trustAsResourceUrl("caesar-cipher.mp4"), type: "video/mp4"
			},
		],
		theme: {
			url: "authoring/videogular.css",
		},
		plugins: {
			cuepoints: {
				theme: {
					url: "bower_components/videogular-cuepoints/cuepoints.css",
				},
			},
			questions: {
				data:{
					url: "",
				},
			},
		},
	};

	$rootScope.$on("blob_url", function(event, url) {
		console.log("got url " + url);

		$scope.config.plugins.questions.data.url = url;
	});

})

.controller('SetAddCtrl',  function ($scope){
	$scope.sets = [];

	$scope.addQuestionSet = function() {
		var newSetNo = $scope.sets.length;
		$scope.sets.push({id: newSetNo, header: 'Question Set ' + (newSetNo + 1)});
	};
})

.directive('questionOptionsBlock', function(){
	return {
		restrict: 'E',
		templateUrl: 'authoring/questionOptions.html',
		scope: {
			heading: '@',
		},
		controller: 'questionOptionsBlockCtrl',
	};
})

.controller('questionOptionsBlockCtrl', function($scope) {
	$scope.options = {
		"questionCanBeSkipped": false,
		"ifIncorrectReturnToTime": false,
		"recordResponses": false,
		"showResponseWhen": 'afterEach',
	};

	$scope.$watch('options', function(newVal, oldVal) {
		$scope.$parent.questionData.options = newVal;
	}, true); //note this is a deep watch and is slow

})

.controller('SectionAddCtrl',  function ($scope){
	$scope.questions = [];

	var pollNo = 0;
	var quizNo = 0;

	$scope.addPoll = function() {
		pollNo = pollNo + 1;

		return $scope.questions.push({
			questionId: $scope.questions.length,
			name: 'Poll ' + pollNo,
			type: 'poll',
		});
	};

	$scope.addQuestion = function() {
		quizNo = quizNo + 1;
		return $scope.questions.push({
			questionId: $scope.questions.length,
			name: 'Question ' + quizNo,
			type: 'quiz',
		});
	};

	Array.prototype.swap = function (x,y) {
		var b = this[x];
		this[x] = this[y];
		this[y] = b;
		return this;
	};

	Array.prototype.getIndexByVal = function (toGet) {
		var index = -1;
		for (var i = 0; i < this.length; i++) {
			if (this[i].name === toGet.name) index = i;
		}
		return index;
	};

})

.directive('questionSet', function() {
	return {
		restrict: 'E',
		templateUrl: 'authoring/questionSet.html',
		scope: {
			questionSetId: '@',
			heading: '@',
		},
		controller: 'questionSetCtrl',
	};
})

.controller('questionSetCtrl', function($scope) {
	$scope.questionSetData = {
		timeAppear: new Date(0),
		questions: [],
	};

	$scope.$watch('questionSetData', function(newVal, oldVal) {
		$scope.$parent.data.questionSet[$scope.questionSetId] = newVal;
	}, true); //note this is a deep watch and is slow

})

/* This is an insanely useful directive, prints the current scope, use it in place of batarang as it mainly fails */
.directive('debugScopeButton', function() {
	return {
		restrict: 'E',
		template: '<button type="button" class="btn  btn-warning btn-xs" ng-click="debugScope()">debug scope</button>',
		scope: {
			toEcho: "=toEcho",
		},
		controller: ['$scope', function($scope) {
			$scope.debugScope = function() {
				console.log($scope.toEcho);
			};
		}],
	};
})

.directive('questionBlock', function(){
	return {
		restrict: 'E',
		require: '^questionSet',
		templateUrl: 'authoring/questionBlock.html',
		scope: {
			questionId: '@',
			heading: '@',
			type: '@',
		},
		controller: 'questionBlockCtrl',
	};
})

.controller('questionBlockCtrl', function($scope) {
	$scope.questionData = {
		title: '',
		type: '',
		answerData: {},
	};

	$scope.moveQuestionUp = function(event, toMove) {
		event.preventDefault();
		event.stopPropagation();

		var index = $scope.$parent.questions.getIndexByVal(toMove);
		console.dir(index);
		if (index > 0) {
			$scope.$parent.questions.swap(index, index - 1);
		}
		console.dir($scope.$parent.questions);
	};

	$scope.moveQuestionDown = function(event, toMove) {
		event.preventDefault();
		event.stopPropagation();

		var index = $scope.$parent.questions.getIndexByVal(toMove);
		console.dir(index);
		if (index < $scope.$parent.questions.length - 1){
			$scope.$parent.questions.swap(index, index + 1);
		}
		console.dir($scope.$parent.questions);
	};

	this.getType = function() {
		return $scope.type;
	};

	$scope.$watch('questionData', function(newVal, oldVal) {
		$scope.$parent.questionSetData.questions[$scope.questionId] = newVal;
	}, true); //note this is a deep watch and is slow
})

.directive('multipleChoice', function(){
	return{
		restrict: 'E',
		require: '^questionBlock',
		templateUrl: 'authoring/answerPanel/multipleChoice.html',
		scope: {
			single: '@',
		},
		link: function(scope, element, attrs, ctrl) {
			scope.type = ctrl.getType();
		},
	};
})

.controller('AddAnswerCtrl',  function ($scope){
	$scope.answerData = {
		answers: [],
		correct: '',
		minanswers: '',
		maxanswers: '',
	};

	$scope.$watch('answerData', function(newVal, oldVal) {
		$scope.$parent.$parent.questionData.answerData = newVal;
	}, true); //note this is a deep watch and is slow

	$scope.onAnswerBoxKeyDown = function($event) {
		if ($event.keyCode === 13) {
			$scope.addAnswer($scope.answerInput);
		}
	};

	$scope.addAnswer = function(newAnswer) {
		newAnswer = newAnswer || '';
		if (newAnswer.length > 0) {
			if ($scope.answerData.answers.indexOf(newAnswer) === -1){
				$scope.answerData.answers.push(newAnswer);
			}
			$scope.answerInput = "";
		}
	};

	var applyToEach = function(fn) {
		return function(list) {
			for (var i in list) { fn(list[i]); }
		};
	};

	$scope.removeAnswers = applyToEach(function(toRemove) {
		var index = $scope.answerData.answers.indexOf(toRemove);
		if (index !== -1) {
			$scope.answerData.answers.splice(index, 1);
		}
	});

	$scope.moveAnswersUp = applyToEach(function(toMove) {
		var index = $scope.answerData.answers.indexOf(toMove);
		if (index > 0) {
			var temp = $scope.answerData.answers[index - 1];
			$scope.answerData.answers[index - 1] = $scope.answerData.answers[index];
			$scope.answerData.answers[index] = temp;
		}
	});

	$scope.moveAnswersDown = applyToEach(function(toMove) {
		var index = $scope.answerData.answers.indexOf(toMove);
		if (index < $scope.answerData.answers.length - 1) {
			var temp = $scope.answerData.answers[index];
			$scope.answerData.answers[index] = $scope.answerData.answers[index + 1];
			$scope.answerData.answers[index + 1] = temp;
		}
	});

	$scope.setCorrect = function (toSet) {
		$scope.answerData.correct = toSet;
	};
})

.directive('stars', function(){
	return {
		restrict: 'E',
		require: '^questionBlock',
		templateUrl: 'authoring/answerPanel/stars.html',
		controller: 'starsCtrl',
	};
})

.controller('starsCtrl', function($scope) {
	$scope.answerData = {
		minvalue: 0,
		maxvalue: 0,
	};

	$scope.$watch('answerData', function(newVal, oldVal) {
		$scope.$parent.questionData.answerData = newVal;
	}, true); //note this is a deep watch and is slow
})

.directive('range', function(){
	return {
		restrict: 'E',
		require: '^questionBlock',
		templateUrl: 'authoring/answerPanel/range.html',
		controller: 'rangeCtrl'
	};
})

.controller('rangeCtrl', function($scope) {
	$scope.answerData = {
		minvalue: 0,
		maxvalue: 0,
		stepvalue: 0
	};

	$scope.$watch('answerData', function(newVal, oldVal) {
		$scope.$parent.questionData.answerData = newVal;
	}, true); //note this is a deep watch and is slow
})


.directive('text', function(){
	return {
		restrict: 'E',
		require: '^questionBlock',
		templateUrl: 'authoring/answerPanel/text.html',
		controller: 'textCtrl'
	};
})

.controller('textCtrl', function($scope) {
	$scope.answerData = {
		correctAnswer: ''
	};

	$scope.$watch('answerData', function(newVal, oldVal) {
		$scope.$parent.questionData.answerData = newVal;
	}, true); //note this is a deep watch and is slow
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

function processQuestion(data, getQuestionID) {
	var question = {};

	var typeConversion = {
		"Multiple choice" : "multiple",
		"Rating" : "stars",
		"Range selector" : "range",
		"Text" : "text"
	};

	if (!(data.type in typeConversion)) {
		console.error("unknown question type " + data.type);
	}

	question.type = typeConversion[data.type];
	question.question = data.title;

	if(['single', 'multiple'].indexOf(question.type) !== -1) {
		question.options = data.answerData.answers.map(function(answer) {
			return {
				name: answer,
			};
		});

		question.correctAnswer = data.answerData.correct;
	}

	if(question.type === 'multiple') {
		// This checks if the multiple question is actually a single one in disguise
		// and changes it
		if(question.correctAnswer.length === 1 &&
		   data.answerData.minanswers === 1 &&
		   data.answerData.maxanswers === 1) {

			question.type = 'single';
			question.correctAnswer = question.correctAnswer[0];
		} else {
			question.min = data.answerData.minanswers;
			question.max = data.answerData.maxanswers;
		}
	}else if(question.type === 'stars') {
		question.min = data.answerData.minvalue;
		question.max = data.answerData.maxvalue;
	}else if(question.type === 'range') {
		question.min = data.answerData.minvalue;
		question.max = data.answerData.maxvalue;
		question.step = data.answerData.stepvalue;
	}else if(question.type === 'text') {
		question.correctAnswer = data.answerData.correctAnswer;
	}

	question.id = getQuestionID();

	var questionString = JSON.stringify(question, null, 4);

	return [questionString];
}

function processQuestionSet(data, getQuestionID) {
	var push = [].push;

	var items = [];
	data.questions.forEach(function(question) {
		// put all the objects returned by processQuestion in to the items array
		push.apply(items, processQuestion(question, getQuestionID));
	});

	var questionSet = {
		items: "ITEMS",
	};

	questionSet.time = data.timeAppear.getTime() / 1000;

	var questionSetString = JSON.stringify(questionSet, null, 4);

	questionSetString = questionSetString.replace('"ITEMS"', "[\n" + items.join() + "\n]\n");

	return questionSetString;
}

function exportWebWorker(data) {

	var annotationString = "{\n";

	var questionIDCounter = 0;
	var getQuestionID = function() {
		return "" + questionIDCounter++;
	};

	data.questionSet.forEach(function(questionSet, index) {
		var questionSetString = processQuestionSet(data.questionSet[index], getQuestionID);

		annotationString += "question" + index + ": " + questionSetString;
	});

	annotationString += "\n}";

	var questionsWorkerURL = window.location.protocol + "//" + window.location.host + window.location.pathname + "bower_components/videogular-questions/questions-worker.js";

	var template = '/* jshint worker: true */\n\
"use strict";\n\
\n\
importScripts("WORKER_URL");\n\
\n\
/* global loadAnnotations */\n\
loadAnnotations(ANNOTATION_DATA);';

	var result = template.replace("ANNOTATION_DATA", annotationString)
	                     .replace("WORKER_URL", questionsWorkerURL);

	return result;
}

})();
