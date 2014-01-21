'use strict';

// It should receive a folder that it'll look at 
var postLocation = '';

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


// Matches alphanumeric and underscore 1 or more times
//new RegExp('^[a-z0-9_]+$');

module.exports = function(path) {
  postLocation = path;
};