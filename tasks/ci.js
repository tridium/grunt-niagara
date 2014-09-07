/** @module */

'use strict';

/**
 * The `ci` task from JSHint and Karma, with code coverage reports generated.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  var tasks = [];
  if (grunt.config('jshint')) {
    tasks.push('jshint:ci');
  }

  if (grunt.config('karma')) {
    tasks.push('karma:ci');
  }

  grunt.registerTask('ci', tasks);
};