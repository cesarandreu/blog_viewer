'use strict';

angular.module('cesarandreuApp')
.directive('caLoader', function (promiseTracker) {
  return {
    template: '<div ng-if="loading.active()" ng-transclude></div>',
    transclude: true,
    restrict: 'E',
    scope: {
      promise: '@'
    },
    link: function postLink(scope, iElement, iAttrs) {
      scope.loading = promiseTracker(iAttrs.promise);
    }
  };
});
