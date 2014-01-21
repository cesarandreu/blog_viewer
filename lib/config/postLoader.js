'use strict';

/*
* The folder should have this structure:
*  folder/post_name_urlized
*     ./post_name_urlized.md
*     ./post_name_urlized.meta.json
*
*
*   So we test that it is properly urlized,
*   We then test if it contains the .md and .meta.json file
*
*   Then we fetch the Post model
*     -> if it exists, compare values
*         -> if it diverges, update everything
*     -> else, create new Post
*/

var  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  q = require('q'),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post');


var validNameRegex = new RegExp('^[a-z0-9_]+$');
function validFolder(name) {
  return validNameRegex.test(name);
}

// Reads each urlized_folder in the starting location
function readPosts(location) {
  var deferred = q.defer();
  fs.readdir(location, function(err, folders) {
    if (err) {
      deferred.reject(err);
    } else {
      folders = _.filter(folders, function(folder) {
        return validFolder(folder);
      });
      deferred.resolve(folders);
    }
  });
  return deferred.promise;
}

// Checks if it contains the urlized.md and urlized.meta.json files
// After doing this I've realized it's not really needed. Derp.
function checkFiles(folder, name) {
  var deferred = q.defer();
  fs.readdir(folder, function (err, files) {
    if (err) {
      deferred.reject(err);
    } else {

      if (_.contains(files, name+'.md') && _.contains(files, name+'.meta.json')) {
        deferred.resolve(name);
      } else {
        deferred.reject('Markdown or Meta JSON file were not found.');
      }
    }
  });
  return deferred.promise;
}

function fetchModel(title) {
  var deferred = q.defer();
  Post.findOne({
    title: new RegExp(title.replace(/_/g, ' '), 'i')
  })
  .exec(function (err, post) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(post);
    }
  });
  return deferred.promise;
}

function readFile(file) {
  var deferred = q.defer();
  fs.readFile(file, 'utf-8', deferred.makeNodeResolver());
  return deferred.promise;
}

function newPost(metajson, markdown) {
  var deferred = q.defer();
  Post.create({
    title: metajson.title,
    fileName: metajson.fileName,
    createdAt: new Date(metajson.createdAt),
    body: markdown
  }, deferred.makeNodeResolver());
  return deferred.promise;
}

function modelCheck(model, metajson, markdown) {
  var deferred = q.defer();

  var compared = {
    title: model.title === metajson.title,
    fileName: model.fileName === metajson.fileName,
    tags: _.isEqual(model.tags, metajson.tags),
    body: model.body === markdown,
    createdAt: model.createdAt.getTime() === (new Date(metajson.createdAt)).getTime()
  };

  if (compared.title && compared.fileName && compared.body && compared.createdAt) {
    console.log('No model changes for', metajson.title);
    deferred.resolve(model);
  } else {
    console.log('New model must be created for', model.title);
    _.forIn(compared, function (value, key) {
      if (value) {
        var newVal = metajson[key];
        if (key === 'body') newVal = markdown;
        else if (key === 'createdAt') newVal = new Date(metajson.createdAt);
        console.log(key, 'changed. It was:', model[key], 'now it\'s:', newVal);
      }
    });
    model.remove(function (err) {
      if (err) {
        deferred.reject(err);
      } else {
        newPost(metajson, markdown)
        .then(function (model) {
          deferred.resolve(model);
        }, function (err) {
          deferred.reject(err);
        });
      }
    });
  }
  return deferred.promise;
}


module.exports = function(startingPath) {
  readPosts(startingPath).then(function (posts) {

    _.forEach(posts, function (post) {

      //Check if .md and .meta.json files are there
      checkFiles(path.join(startingPath, post), post)

      //Get post model
      //Read markdown file
      //Read meta.json file
      .then(function (title) {
        var markdown = path.join(startingPath, title, title+'.md');
        var metajson = path.join(startingPath, title, title+'.meta.json');
        return q.all([fetchModel(title), readFile(markdown), readFile(metajson)]);
      }, function (err) {
        console.log('Error in checkFiles:', err);
      })

      //Create new model or check model state
      .then(function (things) {
        var model = things[0];
        var markdown = things[1];
        var metajson = JSON.parse(things[2]);
        if (model === null) {
          console.log('Creating new model.');
          return newPost(metajson, markdown);
        } else {
          console.log('Checking model.');
          return modelCheck(model, metajson, markdown);
        }
      }, function (err) {
        console.log('Error getting post model, reading markdown or metajson file:', err);
      })

      .then(function () {
        console.log('DONE');
      }, function (err) {
        console.log('Error:', err);
      });

    });

  }, function (err) {
    console.log('Error in readPost:', err);
  });
};



