/* eslint-env node */

'use strict';

const babelConfig = require('../conf/babelConfig'),
  copyConfig = require('../conf/copyConfig'),
  loadTasksRelative = require('../lib/loadTasksRelative');

/**
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {
  if (!grunt.config('babel')) { return; }

  grunt.config('babel', babelConfig(grunt));
  grunt.config('copy', copyConfig(grunt));

  loadTasksRelative(grunt, 'grunt-babel');
  loadTasksRelative(grunt, 'grunt-contrib-copy');
};
