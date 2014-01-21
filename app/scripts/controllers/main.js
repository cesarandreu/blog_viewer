'use strict';

angular.module('cesarandreuApp')
  .controller('MainCtrl', function ($scope, $http, $routeParams, Post) {
    $scope.posts = Post.getList();

    var currentPage = 0;
    var page = parseInt($routeParams.page, 10);
    if (page > 0) {
      currentPage = page;
    }
    Post.fetchList(currentPage);

    $scope.previousPage = currentPage - 1;
    $scope.nextPage = currentPage ? currentPage + 1 : currentPage + 2;

  });
