'use strict';

angular.module('cesarandreuApp', [
  'ngAnimate',
  'ngRoute',
  'hc.marked',
  'ui.bootstrap',
  'ngDisqus',
  'angulartics',
  'angulartics.google.analytics'
])
  .constant('_', _)
  .config(function ($routeProvider, $locationProvider, $disqusProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl',
        resolve: {
          posts: ['Post', function(Post) {
            Post.fetchList(0);
          }]
        }
      })
      .when('/posts/:page', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl',
        resolve: {
          posts: ['Post', '$route', '$location', function(Post, $route, $location) {
            var page = parseInt($route.current.params.page, 10);
            if (typeof page !== 'number' || page !== page || page < 1) {
              $location.path('/posts/1');
            } else {
              return Post.fetchList(page);
            }
          }]
        }
      })
      .when('/post/:title', {
        templateUrl: 'partials/post',
        controller: 'PostCtrl',
        resolve: {
          post: ['Post', '$route', function (Post, $route) {
            return Post.fetch($route.current.params.title);
          }]
        }
      })
      .when('/about', {
        templateUrl: 'partials/about'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);

    $disqusProvider.setShortname('cesarandreu-blog');
  });
