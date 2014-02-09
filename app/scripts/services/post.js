'use strict';

angular.module('cesarandreuApp')
.service('Post', function Post(ModelFetcher, $angularCacheFactory, _) {

  var index = new ModelFetcher({
    url: function (params) {
      return '/api/posts/' + params.page;
    },
    link: function (params) {
      return '/posts/'+params.page;
    },
    validate: function (params) {
      params = params || {};
      params.page = parseInt(params.page, 10);
      return _.isNumber(params.page) && params.page > 0;
    },
    modelToParameters: function (model) {
      return {
        page: model.page
      };
    },
    cache: $angularCacheFactory('PostIndex', {
      capacity: 5,
      storageMode: 'localStorage'
    })
  });

  var show = new ModelFetcher({
    url: function (params) {
      return '/api/post/' + params.title;
    },
    link: function (params) {
      return '/post/' + params.title;
    },
    validate: function (params) {
      params = params || {};
      return _.isString(params.title) && params.title.length > 0;
    },
    modelToParameters: function (model) {
      return {
        title: model.urlize
      };
    },
    cache: $angularCacheFactory('PostShow', {
      capacity: 5,
      storageMode: 'localStorage'
    })
  });

  return {
    index: index,
    show: show
  };


});
