'use strict';

angular.module('authoringTool.version', [
  'authoringTool.version.interpolate-filter',
  'authoringTool.version.version-directive'
])

.value('version', '0.1');
