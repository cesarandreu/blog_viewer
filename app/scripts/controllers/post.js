'use strict';

angular.module('cesarandreuApp')
  .controller('PostCtrl', function ($scope, post) {
    $scope.post = post;
  });
