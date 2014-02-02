'use strict';

angular.module('cesarandreuApp')
  .controller('PostCtrl', function ($scope, $routeParams, $location, Post, Title) {
    $scope.post = Post.get($routeParams.title);
    Title.set(Post.get($routeParams.title).title);

    // Post.fetch(title).catch(function(err) {
    //   $scope.alerts.push({
    //     msg: err,
    //     type: 'danger'
    //   });
    // });

    // $scope.alerts = [];
    // $scope.closeAlert = function(index) {
    //   $scope.alerts.splice(index, 1);
    // };

  });
