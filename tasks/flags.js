/** @module */

'use strict';

var path = require('path'),
    extend = require('../lib/deepExtend'),
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
        defaults = extend({}, cliDefaults);

    //stringify any boolean/number values
    for (var prop in defaults) {
      if (defaults.hasOwnProperty(prop)) {
        defaults[prop] = String(defaults[prop]);
      }
    }

    grunt.log.write(templateAndPrint(fileName, defaults));
  });
};
