'use strict';

describe('Service: CommonServices', function () {

  // load the service's module
  beforeEach(module('jeniusApp'));

  // instantiate service
  var CommonServices;
  beforeEach(inject(function (_CommonServices_) {
    CommonServices = _CommonServices_;
  }));

  it('should do something', function () {
    expect(!!CommonServices).toBe(true);
  });

});
