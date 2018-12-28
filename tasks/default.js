/* eslint-env node */

/** @module */

'use strict';

/**
 * The `default` task prints out usage information.
 *
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {
  grunt.registerTask('default', [ 'usage' ]);
};
