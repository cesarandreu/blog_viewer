'use strict';

angular.module('cesarandreuApp')
  .filter('urlize', function () {
    return function (input) {
      if (typeof input !== 'string') {
        return '';
      } else {
        return input.toLowerCase().replace(/ /g, '_');
      }

    };
  });
