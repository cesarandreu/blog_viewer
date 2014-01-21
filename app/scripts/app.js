'use strict';

angular.module('cesarandreuApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'hc.marked',
  'ui.bootstrap',
  'ngDisqus'
])
  .constant('_', _)
  .config(function ($routeProvider, $locationProvider, $httpProvider, $disqusProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .when('/posts', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/posts/:title', {
        templateUrl: 'partials/post',
        controller: 'PostCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    //$locationProvider.hashPrefix('!');
    $locationProvider.html5Mode(true);

    // Intercept 401s and 403s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401 || response.status === 403) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);

    $disqusProvider.setShortname('cesarandreu-blog');

  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {

      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
      if (next.admin && !Auth.isLoggedIn()) {
        $location.path('/');
      }

    });
  });
