'use strict';

angular.module('cesarandreuApp')
  .controller('MainCtrl', function ($scope, Title, data) {
    $scope.data = data;

    if (data.page > 1) {
      Title.set('Page ' + data.page);
    } else {
      Title.set();
    }

  });
