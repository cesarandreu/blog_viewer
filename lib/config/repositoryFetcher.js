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

var fs = require('fs'),
  exec = require('child_process').exec,
  child;

function puts(err, stdout, stderr) {
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
  if (err) {
    console.log('exec error:', err);
  }
}

function gitClone(directory, repository) {
  
}

module.exports = function (directory, repository) {
  fs.mkdir(directory, function (err) {
    if (err) {
      if (err.code !== 'EEXIST') {
        console.warn('ERROR', err);
      } else {
        //Folder already exists.
      }
    } else {
      //Folder didn't exist.

    }
  });
};