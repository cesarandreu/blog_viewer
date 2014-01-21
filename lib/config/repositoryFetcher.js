'use strict';
/*
* Check if <folder> exists, if not, create it.
*   -> if it doesn't exist then git clone into folder
*
* git pull inside folder to ensure latest version
*
* run postLoader
*
*/

//This should really be using this package instead: https://github.com/notatestuser/gift
//TODO: Make this code non-horrible.

var fs = require('fs'),
  exec = require('child_process').exec,
  child,
  q = require('q'),
  _ = require('lodash');

function gitClone(directory, repository) {
  var deferred = q.defer();
  child = exec('git clone ' + repository + ' ' + directory, function (err, stdout, stderr) {
    if (err) {
      var ignore = ['fatal: destination path', 'already exists and is not an empty directory.'];
      if (_.contains(stderr, ignore[0]) && _.contains(stderr, ignore[1])) {
        deferred.resolve(stderr);
      } else {
        deferred.reject(err);
      }
    } else {
      deferred.resolve(stdout);
    }
  });
  return deferred.promise;
}

function gitPull(directory) {
  var deferred = q.defer();
  child = exec('git -C ' + directory + ' pull', function (err, stdout) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(stdout);
    }
  });
  return deferred.promise;
}

module.exports = function (directory, repository) {
  var deferred = q.defer();

  fs.mkdir(directory, function (err) {
    if (err && err.code !== 'EEXIST') {
      console.warn('ERROR', err);
      deferred.reject(err);
    } else {
      gitClone(directory, repository)
      .then(function () {
        return gitPull(directory);
      }, function (err) {
        console.warn('ERROR in gitClone:', err);
        deferred.reject(err);
      })
      .then(function () {
        deferred.resolve();
      }, function (err) {
        console.warn('ERROR in gitClone:', err);
        deferred.reject(err);
      });

    }
  });
  return deferred.promise;
};
