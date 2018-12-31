/* eslint-env node */

/** @module */

'use strict';

/**
 * The `ci` task runs ESLint and Karma, with code coverage reports generated.
 *
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {
  var tasks = [];
  if (grunt.config('eslint')) {
    tasks.push('eslint:ci');
  }

  if (grunt.config('karma')) {
    tasks.push('karma:ci');
  }

  if (grunt.config('babel')) {
    tasks = [ 'babel:coverage', 'babel:spec', 'copy:karma' ].concat(tasks);
  }

  grunt.registerTask('ci', tasks);
};
