'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

/**
 * Main application file
 */

// Default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

// Populate empty DB with sample data
require('./lib/config/dummydata');

// Enable github fetcher and database loader
//require('./lib/config/postLoader')(config.postLocation);
//require('./lib/config/repositoryFetcher')(config.postLocation, config.repository);
var repositoryFetcher = require('./lib/config/repositoryFetcher');
var postLoader = require('./lib/config/postLoader');

var fetch = function () {
  (function (postLocation, repository) {
    console.log('STARTING FETCH');
    repositoryFetcher(postLocation, repository)
    .then(function () {
      postLoader(postLocation);
    }).finally(function () {
      console.log('FINISHED FETCH');
    });
  })(config.postLocation, config.repository);
};
fetch();

// Run fetch once an hour
var fetchInterval = setInterval(fetch, 60*60*1000);

// Passport Configuration
require('./lib/config/passport')();

var app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
