'use strict';

angular.module('cesarandreuApp')
  .controller('PostCtrl', function ($scope, Title, post) {
    $scope.post = post;
    Title.set(post.title);
  });
