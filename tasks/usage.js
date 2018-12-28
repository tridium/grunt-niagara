/* eslint-env node */

/** @module */

'use strict';

var path = require('path'),
    templateAndPrint = require('../lib/templateAndPrint');

/**
 * The `usage` task prints out information on how to use `grunt-niagara`.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  grunt.registerTask('usage', 'Prints out usage information', function () {
    var fileName = path.resolve(__dirname, '../info/usage.hbs');
    grunt.log.write(templateAndPrint(fileName, {
      eslint: grunt.config('eslint'),
      karma: grunt.config('karma'),
      jsdoc: grunt.config('jsdoc'),
      watch: grunt.config('watch')
    }));
  });
};
