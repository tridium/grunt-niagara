/* eslint-env node */

/** @module */

'use strict';

var eslintConfig = require('../conf/eslintConfig'),
  loadTasksRelative = require('../lib/loadTasksRelative');

/**
 * The `eslint` task runs ESLint validation on all source files.
 *
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {
  if (!grunt.config('eslint')) {
    return;
  }

  loadTasksRelative(grunt, 'grunt-eslint');
  grunt.config('eslint', eslintConfig(grunt));
};
