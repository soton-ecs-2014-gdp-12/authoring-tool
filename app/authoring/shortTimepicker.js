/* jshint browser: true */

/* Adapted from Angular UI's Bootstrap time picker control
 * (https://github.com/angular-ui/bootstrap/blob/master/src/timepicker/timepicker.js),
 * which has the following license:
 *
 * The MIT License
 * Copyright (c) 2012-2014 the AngularUI Team, https://github.com/organizations/angular-ui/teams/291112
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function() {
'use strict';

angular.module('authoringTool.shorttimepicker', [])

.constant('shortTimepickerConfig', {
	minuteStep: 1,
	secondStep: 1,
	millisecondStep: 1,
	readonlyInput: false,
	mousewheel: true
})

.controller('ShortTimepickerController', ['$scope', '$attrs', '$parse', '$log', '$locale', 'shortTimepickerConfig', function($scope, $attrs, $parse, $log, $locale, shortTimepickerConfig) {
	var selected = new Date(),
	    ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl

	this.init = function( ngModelCtrl_, inputs ) {
		ngModelCtrl = ngModelCtrl_;
		ngModelCtrl.$render = this.render;

		var minutesInputEl = inputs.eq(0),
		    secondsInputEl = inputs.eq(1),
    		millisecondsInputEl = inputs.eq(2);

		var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : shortTimepickerConfig.mousewheel;
		if ( mousewheel ) {
			this.setupMousewheelEvents(minutesInputEl, secondsInputEl, millisecondsInputEl);
		}

		$scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : shortTimepickerConfig.readonlyInput;
		this.setupInputEvents(minutesInputEl, secondsInputEl, millisecondsInputEl);
	};

	var minuteStep = shortTimepickerConfig.minuteStep;
	if ($attrs.minuteStep) {
		$scope.$parent.$watch($parse($attrs.minuteStep), function(value) {
			minuteStep = parseInt(value, 10);
		});
	}

	var secondStep = shortTimepickerConfig.secondStep;
	if ($attrs.secondStep) {
		$scope.$parent.$watch($parse($attrs.secondStep), function(value) {
			secondStep = parseInt(value, 10);
		});
	}

	var millisecondStep = shortTimepickerConfig.millisecondStep;
	if ($attrs.millisecondStep) {
		$scope.$parent.$watch($parse($attrs.millisecondStep), function(value) {
			millisecondStep = parseInt(value, 10);
		});
	}

	function getMinutesFromTemplate() {
		var minutes = parseInt($scope.minutes, 10);
		return ( minutes >= 0 && minutes < 60 ) ? minutes : undefined;
	}

	function getSecondsFromTemplate() {
		var seconds = parseInt($scope.seconds, 10);
		return ( seconds >= 0 && seconds < 60 ) ? seconds : undefined;
	}

	function getMillisecondsFromTemplate() {
		var milliseconds = parseInt($scope.milliseconds, 10);
		return ( milliseconds >= 0 && milliseconds < 1000 ) ? milliseconds : undefined;
	}

	function pad( value ) {
		return ( angular.isDefined(value) && value.toString().length < 2 ) ? '0' + value : value;
	}

	function padMilliseconds(value) {
		if (value < 10) {
			return '00' + value;
		} else if (value < 100) {
			return '0' + value;
		} else {
			return value;
		}
	}

	// Respond on mousewheel spin
	this.setupMousewheelEvents = function(minutesInputEl, secondsInputEl, millisecondsInputEl) {
		var isScrollingUp = function(e) {
			if (e.originalEvent) {
				e = e.originalEvent;
			}
			//pick correct delta variable depending on event
			var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
			return (e.detail || delta > 0);
		};

		minutesInputEl.bind('mousewheel wheel', function(e) {
			$scope.$apply( (isScrollingUp(e)) ? $scope.incrementMinutes() : $scope.decrementMinutes() );
			e.preventDefault();
		});

		secondsInputEl.bind('mousewheel wheel', function(e) {
			$scope.$apply( (isScrollingUp(e)) ? $scope.incrementSeconds() : $scope.decrementSeconds() );
			e.preventDefault();
		});

		millisecondsInputEl.bind('mousewheel wheel', function(e) {
			$scope.$apply( (isScrollingUp(e)) ? $scope.incrementMilliseconds() : $scope.decrementMilliseconds() );
			e.preventDefault();
		});
	};

	this.setupInputEvents = function(minutesInputEl, secondsInputEl, millisecondsInputEl) {
		if ( $scope.readonlyInput ) {
			$scope.updateMinutes = angular.noop;
			$scope.updateSeconds = angular.noop;
			$scope.updateMilliseconds = angular.noop;
			return;
		}

		var invalidate = function(invalidMinutes, invalidSeconds, invalidMilliseconds) {
			ngModelCtrl.$setViewValue( null );
			ngModelCtrl.$setValidity('time', false);
			if (angular.isDefined(invalidMinutes)) {
				$scope.invalidMinutes = invalidMinutes;
			}
			if (angular.isDefined(invalidSeconds)) {
				$scope.invalidSeconds = invalidSeconds;
			}
			if (angular.isDefined(invalidMilliseconds)) {
				$scope.invalidMilliseconds = invalidMilliseconds;
			}
		};

		$scope.updateMinutes = function() {
			var minutes = getMinutesFromTemplate();

			if ( angular.isDefined(minutes) ) {
				selected.setMinutes( minutes );
				refresh( 'm' );
			} else {
				invalidate(true);
			}
		};

		minutesInputEl.bind('blur', function(e) {
			if ( !$scope.invalidMinutes && $scope.minutes < 10) {
				$scope.$apply( function() {
					$scope.minutes = pad( $scope.minutes );
				});
			}
		});

		$scope.updateSeconds = function() {
			var seconds = getSecondsFromTemplate();

			if ( angular.isDefined(seconds) ) {
				selected.setSeconds( seconds );
				refresh( 's' );
			} else {
				invalidate(undefined, true);
			}
		};

		secondsInputEl.bind('blur', function(e) {
			if ( !$scope.invalidSeconds && $scope.seconds < 10 ) {
				$scope.$apply( function() {
					$scope.seconds = pad( $scope.seconds );
				});
			}
		});

		$scope.updateMilliseconds = function() {
			var milliseconds = getMillisecondsFromTemplate();

			if ( angular.isDefined(milliseconds) ) {
				selected.setMilliseconds( milliseconds );
				refresh( 'ms' );
			} else {
				invalidate(undefined, true);
			}
		};

		millisecondsInputEl.bind('blur', function(e) {
			if ( !$scope.invalidMilliseconds && $scope.milliseconds < 100 ) {
				$scope.$apply( function() {
					$scope.milliseconds = padMilliseconds($scope.milliseconds);
				});
			}
		});

	};

	this.render = function() {
		var date = ngModelCtrl.$modelValue ? new Date( ngModelCtrl.$modelValue ) : null;

		if ( isNaN(date) ) {
			ngModelCtrl.$setValidity('time', false);
			$log.error('Shorttimepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
		} else {
			if ( date ) {
				selected = date;
			}
			makeValid();
			updateTemplate();
		}
	};

	// Call internally when we know that model is valid.
	function refresh( keyboardChange ) {
		makeValid();
		ngModelCtrl.$setViewValue(new Date(selected.getTime()));
		updateTemplate( keyboardChange );
	}

	function makeValid() {
		ngModelCtrl.$setValidity('time', true);
		$scope.invalidMinutes = false;
		$scope.invalidSeconds = false;
		$scope.invalidMilliseconds = false;
	}

	function updateTemplate( keyboardChange ) {
		var minutes = selected.getMinutes(), seconds = selected.getSeconds(), milliseconds = selected.getMilliseconds();

		$scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
		$scope.seconds = keyboardChange === 's' ? seconds : pad(seconds);
		$scope.milliseconds = keyboardChange === 'ms' ? milliseconds : padMilliseconds(milliseconds);
	}

	function addMilliseconds( milliseconds ) {
		var dt = new Date(selected.getTime() + milliseconds);
		selected.setMinutes(dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
		refresh();
	}

	$scope.incrementMinutes = function() {
		addMilliseconds(minuteStep * 60000);
	};
	$scope.decrementMinutes = function() {
		addMilliseconds(-minuteStep * 60000);
	};
	$scope.incrementSeconds = function() {
		addMilliseconds(secondStep * 1000);
	};
	$scope.decrementSeconds = function() {
		addMilliseconds(-secondStep * 1000);
	};
	$scope.incrementMilliseconds = function() {
		addMilliseconds(millisecondStep);
	};
	$scope.decrementMilliseconds = function() {
		addMilliseconds(-millisecondStep);
	};
}])

.directive('shorttimepicker', function () {
	return {
		restrict: 'EA',
		require: ['shorttimepicker', '?^ngModel'],
		controller:'ShortTimepickerController',
		replace: true,
		scope: {},
		templateUrl: 'authoring/shortTimepicker.html',
		link: function(scope, element, attrs, ctrls) {
			var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

			if ( ngModelCtrl ) {
				timepickerCtrl.init( ngModelCtrl, element.find('input') );
			}
		}
	};
});

})();
