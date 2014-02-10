'use strict';

var mongoose = require('mongoose'),
    // Thing = mongoose.model('Thing'),
    Post = mongoose.model('Post'),
    _ = require('lodash');

/**
 * Get awesome things
 */
// exports.awesomeThings = function(req, res) {
//   return Thing.find(function (err, things) {
//     if (!err) {
//       return res.json(things);
//     } else {
//       return res.send(err);
//     }
//   });
// };

exports.posts = function(req, res) {
  var limit = 5,
    page = req.param('page') !== undefined ? req.param('page') - 1 : 0;

  return Post
    .find({})
    .sort('-createdAt')
    .limit(limit)
    .skip(limit * page)
    .exec(function(err, posts) {

    if (err || posts.length < 1) {
      return res.send(404, err || 'No posts found in this page.');
    } else {
      return res.json({
        posts: posts,
        page: req.param('page')
      });
    }
  });
};

exports.post = function(req, res) {
  return Post
    .findOne({title: new RegExp(req.param('title').replace(/_/g, ' '), 'i')})
    .exec(function(err, post) {
      if (err || _.isNull(post)) {
        return res.send(404, err || 'Post not found.');
      } else {
        return res.json(post);
      }
    });
};
