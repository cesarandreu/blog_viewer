'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,

  //Post location relative to application root
  postLocation: 'posts',

  //Repository from which to fetch posts
  repository: 'git@github.com:cesarandreu/blog.git',

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};
