'use strict';

angular.module('cesarandreuApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {

    // Mobile navigation
    $scope.isCollapsed = false;

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
