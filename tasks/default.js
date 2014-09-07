/** @module */

'use strict';

/**
 * The `default` task prints out usage information.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  grunt.registerTask('default', [ 'usage' ]);
};