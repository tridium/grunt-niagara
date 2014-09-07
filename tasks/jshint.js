/** @module */

'use strict';

var jshintConfig = require('../conf/jshintConfig'),
    loadTasksRelative = require('../lib/loadTasksRelative');

/**
 * The `jshint` task runs JSHint validation on all source files.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  if (!grunt.config('jshint')) {
    return;
  }

  loadTasksRelative(grunt, 'grunt-contrib-jshint');
  grunt.config('jshint', jshintConfig(grunt));
};