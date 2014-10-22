'use strict';

angular.module('authoringTool.authoring', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/authoring', {
    templateUrl: 'authoring/authoring.html',
    controller: 'AccordionCtrl'
  });
}]);

angular.module('authoringTool').controller('AccordionCtrl', function ($scope) {
  $scope.oneAtATime = true;

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
});

