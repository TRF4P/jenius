'use strict';

describe('Service: CommonService', function () {

  // load the service's module
  beforeEach(module('jeniusApp'));

  // instantiate service
  var CommonService;
  beforeEach(inject(function (_CommonService_) {
    CommonService = _CommonService_;
  }));

  it('should do something', function () {
    expect(!!CommonService).toBe(true);
  });

});
