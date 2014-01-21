'use strict';

angular.module('cesarandreuApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
