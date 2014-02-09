'use strict';

angular.module('cesarandreuApp')
  .service('ModelFetcher', function ModelFetcher($http, $q, $location, promiseTracker, _) {

    var Fetcher = (function() {

      function Fetcher(config) {
        // enforces new
        if (!(this instanceof Fetcher)) {
          return new Fetcher(config);
        }

        if (typeof config.url !== 'function' && typeof config.url !== 'string') {
          throw new Error('Fetcher requires a url');
        }

        if (typeof config.cache !== 'object') {
          throw new Error('Fetcher requires a cache');
        }

        if (typeof config.cache.put !== 'function' || typeof config.cache.get !== 'function') {
          throw new Error('You must define a put and get function on your cache');
        }

        this.cache = config.cache;

        // The URL from the server's perspective. It can be a string or a
        // function which receives parameters as the argument.
        this.url = config.url;

        // The LINK from the router's perspective. It can be a string or a
        // function which receives the parameters as the argument.
        this.link = config.link;

        // OPTIONAL
        // Function which applies filters to data when it's received from the
        // server. Takes the data as an arugment and is expected to return the
        // data that will be passed along to the controller and cache.
        this.filter = config.filter;

        // OPTIONAL
        // Function which takes parameters as the argument and ensures that
        // they are valid. It is expected to return TRUE if they're valid,
        // or FALSE if they're invalid.
        this.validate = config.validate;

        // OPTIONAL
        // Function that takes the data from the page and returns you the
        // parameters object required to get this model's URL or LINK
        this.modelToParameters = config.modelToParameters;

      }

      // ****************************** WRAPPERS ******************************
      // **********************************************************************

      // Checks if parameters are valid, if it's not defined it defaults to true
      // Always use this to check parameter validity
      Fetcher.prototype.validateParameters = function(params) {
        return typeof this.validate === 'function' ? this.validate(params) : true;
      };

      // Applies filter on data or returns untouched data
      // Always use this to filter data, it will work if filter is not defined
      Fetcher.prototype.applyFilter = function (data) {
        return typeof this.filter === 'function' ? this.filter(data) : data;
      };

      // Returns the params from a model or passes the model along
      // Always use this to convert a model to the parameter object
      Fetcher.prototype.modelParams = function (model) {
        return typeof this.modelToParameters === 'function' ? this.modelToParameters(model) : model;
      };

      // **********************************************************************

      // ****************************** FETCHERS ******************************
      // **********************************************************************

      // This fetches the value from the server and places it in the cache
      // Only use this if you want to be certain you get the server's response
      Fetcher.prototype.fetch = function (params) {
        var deferred = $q.defer(),
          self = this,
          url = self.getUrl(params);

        $http.get(url)
        .success(function (data) {
          data = self.applyFilter(data);

          // Checks if the current item in the cache is an object,
          // if it's not an object, then we place an empty object
          if (typeof self.cache.get(url) !== 'object') {
            self.cache.put(url, {});
          }
          var cacheData = self.cache.get(url);
          angular.copy(data, cacheData);
          cacheData = self.cache.put(url, cacheData);
          deferred.resolve(cacheData);
        })
        .error(function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      };

      // This always does a request to the server, but if there's data in the
      // cache it will resolve immediately. Use this if you want data quickly
      // but you also want it to eventually be accurate.
      Fetcher.prototype.get = function (params) {
        var deferred = $q.defer(),
          promise = deferred.promise,
          self = this,
          url = self.getUrl(params),
          cacheVal = self.cache.get(url);

        if (_.isObject(cacheVal) && Object.keys(cacheVal).length > 0) {
          deferred.resolve(self.cache.get(url));
        } else {
          promiseTracker('pageChange').addPromise(promise);
        }

        self.fetch(params).then(function (model) {
          deferred.resolve(model);
        }, function (err) {
          deferred.reject(err);
        });

        return promise;
      };

      // This will only hit the server if the data is not in the cache,
      // otherwise it will just return the cache data. Use this if you
      // don't care that the data might be outdated.
      Fetcher.prototype.getOnly = function (params) {
        var deferred = $q.defer(),
          self = this,
          url = self.getUrl(params),
          cacheVal = self.cache.get(url);

        if (_.isObject(cacheVal) && Object.keys(cacheVal).length > 0) {
          deferred.resolve(self.cache.get(url));
        } else {
          self.fetch(params).then(function (model) {
            deferred.resolve(model);
          }, function (err) {
            deferred.reject(err);
          });
        }
        return deferred.promise;
      };

      // This will check the parameter validity before doing the request
      // It's intended for use in a router's resolve function
      Fetcher.prototype.routeGet = function (params) {
        var self = this,
          deferred = $q.defer();
        if (self.validateParameters(params)) {
          self.get(params).then(function (model) {
            deferred.resolve(model);
          }, function (err) {
            deferred.reject(err);
          });
        } else {
          deferred.reject('Parameters are not valid.');
        }
        return deferred.promise;
      };

      // **********************************************************************

      // *********************** URL / LINK / NAVIGATION **********************
      // **********************************************************************

      // Gets the url of a page, it takes the parameters for that url as the
      // argument.
      Fetcher.prototype.getUrl = function (params) {
        return typeof this.url === 'function' ? this.url(params) : this.url;
      };

      // Get link to page, it takes the parameters for that link as the argument
      Fetcher.prototype.getLink = function (params) {
        return typeof this.link === 'function' ? this.link(params) : this.link;
      };

      // Returns the url for a model
      Fetcher.prototype.modelUrl = function (model) {
        return this.getUrl(this.modelParams(model));
      };

      // Returns the Link for a model
      Fetcher.prototype.modelLink = function (model) {
        return this.getLink(this.modelParams(model));
      };

      // Takes you to a resource when passed the model
      Fetcher.prototype.goByModel = function (model) {
        $location.path(this.modelLink(model));
      };

      // Takes you to a resource when passed the parameters
      Fetcher.prototype.goByParams = function (params) {
        $location.path(this.getLink(params));
      };

      // **********************************************************************

      return Fetcher;

    }());

    return Fetcher;
  });