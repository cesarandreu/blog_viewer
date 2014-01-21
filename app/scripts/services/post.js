'use strict';

angular.module('cesarandreuApp')
  .service('Post', function Post($http, $q) {

    var list = [];
    var post = {};

    var getList = function() {
      return list;
    };

    var fetchList = function(page) {
      if (typeof page !== 'number' || page < 0 || page !== page) {
        page = 0;
      }

      var deferred = $q.defer();
      $http.get('/api/posts?page='+page)
        .success(function(postList) {
          angular.copy(postList, list);
          deferred.resolve(list);
        })
        .error(function(err) {
          console.log('Error: ', err);
          deferred.reject(err);
        });

      return deferred.promise;
    };

    var get = function(name) {
      if (typeof post[name] !== 'object') {
        post[name] = {};
      }
      return post[name];
    };

    var set = function(name, value) {
      if (typeof post[name] !== 'object') {
        post[name] = {};
      }
      return angular.copy(value, post[name]);
    };

    var fetch = function(name) {
      if (typeof name !== 'string' || name.length < 1) {
        name = ' ';
      }

      var deferred = $q.defer();
      $http.get('/api/posts/'+name)
        .success(function(post) {
          if (typeof post === 'object') {
            deferred.resolve(set(name, post));
          } else {
            deferred.reject('Post does not exist.');
          }

        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    return {
      fetchList: fetchList,
      getList: getList,
      get: get,
      fetch: fetch
    };
  });
