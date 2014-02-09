'use strict';

angular.module('cesarandreuApp')
  .controller('MainCtrl', function ($scope, $routeParams, data) {
    $scope.data = data;
  });
