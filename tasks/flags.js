/** @module */

'use strict';

var path = require('path'),
    cliDefaults = require('../lib/cliDefaults'),
    templateAndPrint = require('../lib/templateAndPrint');

/**
 * The `flags` task prints out available command line flags.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  grunt.registerTask('flags', 'Prints out available command line flags', function () {
    var fileName = path.resolve(__dirname, '../info/flags.hbs'),
        options = cliDefaults(grunt);

    //stringify any boolean/number values
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        options[prop] = String(options[prop]);
      }
    }

    grunt.log.write(templateAndPrint(fileName, options));
  });
};
