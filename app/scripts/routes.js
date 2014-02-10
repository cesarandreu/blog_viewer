'use strict';

angular.module('cesarandreuApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        name: 'default',
        templateUrl: 'partials/main',
        controller: 'MainCtrl',
        resolve: {
          data: ['Post', function(Post) {
            return Post.index.routeGet({
              page: 1
            });
          }]
        }
      })
      .when('/posts/:page', {
        name: 'page',
        templateUrl: 'partials/main',
        controller: 'MainCtrl',
        resolve: {
          data: ['Post', '$route', function(Post, $route) {
            return Post.index.routeGet($route.current.params);
          }]
        }
      })
      .when('/post/:title', {
        name: 'title',
        templateUrl: 'partials/post',
        controller: 'PostCtrl',
        resolve: {
          post: ['Post', '$route', function (Post, $route) {
            return Post.show.routeGet($route.current.params);
          }]
        }
      })
      .when('/about', {
        name: 'About me',
        templateUrl: 'partials/about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .run(function ($rootScope, $location, $log, growl) {
    $rootScope.$on('$routeChangeError', function(angularEvent, current, previous, rejection) {
      $log.warn('Route change error.', angularEvent, current, previous, rejection);

      if (typeof rejection === 'string' && rejection.length > 0) {
        growl.addErrorMessage(rejection);
      }

      if (previous && previous.$$route && previous.$$route.originalPath) {
        $location.path(previous.$$route.originalPath);
      }
      else {
        $location.path('/');
      }
    });

  });
