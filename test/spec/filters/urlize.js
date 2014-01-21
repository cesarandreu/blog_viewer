'use strict';

describe('Filter: urlize', function () {

  // load the filter's module
  beforeEach(module('cesarandreuApp'));

  // initialize a new instance of the filter before each test
  var urlize;
  beforeEach(inject(function ($filter) {
    urlize = $filter('urlize');
  }));

  it('should return the input prefixed with "urlize filter:"', function () {
    var text = 'angularjs';
    expect(urlize(text)).toBe('urlize filter: ' + text);
  });

});
