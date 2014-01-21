'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Post = mongoose.model('Post');

/**
 * Populate database with sample application data
 */


// Clear old users, then add a default user
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Cesar Andreu',
    email: 'cesarandreu@gmail.com',
    role: 'admin',
    password: 'test'
  }, function() {
      console.log('finished populating users');
    }
  );
});

// Clear old users, then add a default user
Post.find({}).remove(function() {
  Post.create({
    title: 'Test post 1',
    body: 'Test body 1',
    fileName: 'test1.md',
    tags: ['a', 'b', 'c']
  }, {
    title: 'Test post 2',
    body: 'Test body 2 \n\n awdawdawdawdawdadawda \n\n    hello this is code\n    hello this is second code\n    hello this is second codehello this is second codehello this is second code.',
    fileName: 'test2.md',
  },{
    title: 'Test post 3',
    body: '##Test body 3 \n This is some test \n * hello hello hello \n * bye bye byebye bye byebye bye byebye bye byebye bye byebye bye bye',
    fileName: 'test3.md',
  }, {
    title: 'Test post 4',
    body: 'Test body 4',
    fileName: 'test4.md',
  },{
    title: 'Test post 5',
    body: 'Test body 5',
    fileName: 'test5.md',
  }, {
    title: 'Test post 6',
    body: 'Test body 6',
    fileName: 'test6.md',
  }, function() {
      console.log('finished populating posts');
    }
  );
});

