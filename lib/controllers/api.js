'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Post = mongoose.model('Post');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};

exports.posts = function(req, res) {
  var limit = 5,
    page = req.param('page') > 1 ? req.param('page') - 1 : 0;
    //select = req.param('full') ?  '' : 'title';

  return Post
    .find({})
    .sort('-createdAt')
    .limit(limit)
    .skip(limit * page)
    .exec(function(err, posts) {
    if (!err) {
      return res.json(posts);
    } else {
      return res.send(err);
    }
  });
};

exports.post = function(req, res) {
  return Post
    .findOne({title: new RegExp(req.param('title').replace(/_/g, ' '), 'i')})
    .exec(function(err, post) {
      if (!err) {
        return res.json(post);
      } else {
        return res.send(err);
      }
    });
};

exports.newPost = function(req, res) {


  return res.json(200, {hello: 'world'});
  // var newPost = new Post(req.body);

  // newPost.save(function(err) {
  //   if (err) {
  //     return res.json(400, err);
  //   }
  //   return res.redirect('/posts/'+newPost.get('urlize'));
  // });
};
