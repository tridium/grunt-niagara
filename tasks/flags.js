/* eslint-env node */

/** @module */

'use strict';

var path = require('path'),
    parseOptions = require('../lib/parseOptions'),
    templateAndPrint = require('../lib/templateAndPrint');

/**
 * The `flags` task prints out available command line flags.
 *
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {
  grunt.registerTask('flags', 'Prints out available command line flags', function () {
    var fileName = path.resolve(__dirname, '../info/flags.hbs'),
        options = parseOptions(grunt);

    //stringify any boolean/number values
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        options[prop] = String(options[prop]);
      }
    }

    grunt.log.write(templateAndPrint(fileName, options));
  });
};
