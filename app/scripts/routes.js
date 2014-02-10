'use strict';

angular.module('cesarandreuApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/main',
      controller: 'MainCtrl',
      resolve: {
        data: ['Post', function (Post) {
          return Post.index.routeGet({
            page: 1
          });
        }]
      }
    })
    .state('posts', {
      url: '/posts/:page',
      templateUrl: 'partials/main',
      controller: 'MainCtrl',
      resolve: {
        data: ['Post', '$stateParams', function (Post, $stateParams) {
          return Post.index.routeGet($stateParams);
        }]
      }
    })
    .state('post', {
      url: '/post/:title',
      templateUrl: 'partials/post',
      controller: 'PostCtrl',
      resolve: {
        post: ['Post', '$stateParams', function (Post, $stateParams) {
          return Post.show.routeGet($stateParams);
        }]
      }
    })
    .state('about', {
      url: '/about',
      templateUrl: 'partials/about',
      controller: 'AboutCtrl'
    });

  })

  .run(function ($rootScope, $state, $log, growl) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      $log.warn('Route change error.', event, toState, toParams, fromState, fromParams, error);

      if (typeof error === 'string' && error.length > 0) {
        growl.addErrorMessage(error);
      }

      if (fromState.name) {
        $state.go(name);
      }
      else {
        $state.go('home');
      }
    });

  });
