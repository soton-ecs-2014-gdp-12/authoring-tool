(function() {
'use strict';

// Declare app level module which depends on views, and components
angular.module('authoringTool', [
  'ngRoute',
  'com.2fdevs.videogular',
  'com.2fdevs.videogular.plugins.controls',
  'uk.ac.soton.ecs.videogular.plugins.cuepoints',
  'uk.ac.soton.ecs.videogular.plugins.questions',
  'ui.bootstrap',
  'authoringTool.authoring',
  'authoringTool.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/authoring'});
}]);
})();
