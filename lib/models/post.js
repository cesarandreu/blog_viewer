'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  tags: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: {
    virtuals: true
  }
});

// Virtual fields
PostSchema.virtual('urlize').get(function() {
  return this.title.toLowerCase().replace(/ /g, '_');
});

mongoose.model('Post', PostSchema);
