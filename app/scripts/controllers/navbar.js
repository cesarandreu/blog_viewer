'use strict';

angular.module('cesarandreuApp')
  .controller('NavbarCtrl', function ($scope, $location) {

    // Mobile navigation
    $scope.isCollapsed = false;

    $scope.toggleIsCollapsed = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'About',
      'link': '/about'
    }, {
      'title': 'Twitter',
      'link': 'https://twitter.com/cesarandreu'
    }, {
      'title': 'Github',
      'link': 'https://github.com/cesarandreu'
    }];

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
