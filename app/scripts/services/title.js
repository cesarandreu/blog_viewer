'use strict';

angular.module('cesarandreuApp')
  .service('Title', function Title($window) {

    var defaultValue = 'Cesar Andreu\'s Blog';
    var value = 'Cesar Andreu\'s Blog';

    var set = function (title) {
      if (typeof title === 'string' && title.length > 0) {
        value = title;
      } else {
        value = defaultValue;
      }
      $window.document.title = value;
    };

    var get = function () {
      return value;
    };

    var getDefault = function () {
      return defaultValue;
    };

    return {
      set: set,
      get: get,
      getDefault: getDefault
    };
  });
