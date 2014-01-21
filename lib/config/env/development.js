'use strict';

module.exports = {
  env: 'development',

  //Post location relative to application root
  postLocation: 'posts',

  //Repository from which to fetch posts
  repository: 'git@github.com:cesarandreu/blog.git',

  mongo: {
    uri: 'mongodb://localhost/fullstack-dev'
  }
};
