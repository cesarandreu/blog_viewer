'use strict';

angular.module('cesarandreuApp', [
  'ngAnimate',
  'ngRoute',
  'hc.marked',
  'ui.bootstrap',
  'ngDisqus',
  'angular-growl',
  'ajoslin.promise-tracker',
  'jmdobry.angular-cache',
  'angulartics',
  'angulartics.google.analytics'
])
  .constant('_', _)
  .config(function ($locationProvider, $disqusProvider, growlProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    $disqusProvider.setShortname('cesarandreu-blog');
    $httpProvider.responseInterceptors.push(growlProvider.serverMessagesInterceptor);
    growlProvider.globalTimeToLive(5000);
  });
