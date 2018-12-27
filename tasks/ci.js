/** @module */

'use strict';

/**
 * The `ci` task runs ESLint and Karma, with code coverage reports generated.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  var tasks = [];
  if (grunt.config('eslint')) {
    tasks.push('eslint:ci');
  }

  if (grunt.config('karma')) {
    tasks.push('karma:ci');
  }

  grunt.registerTask('ci', tasks);
};
