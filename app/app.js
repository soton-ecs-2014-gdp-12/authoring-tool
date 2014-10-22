'use strict';

// Declare app level module which depends on views, and components
angular.module('authoringTool', [
  'ngRoute',
  'authoringTool.authoring',
  'authoringTool.version',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/authoring'});
}]);

