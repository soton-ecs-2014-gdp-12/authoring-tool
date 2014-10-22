'use strict';

describe('authoringTool.version module', function() {
  beforeEach(module('authoringTool.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
