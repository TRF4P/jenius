'use strict';

describe('Directive: commonDir', function () {

  // load the directive's module
  beforeEach(module('jeniusApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<common-dir></common-dir>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the commonDir directive');
  }));
});
