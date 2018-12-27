/** @module */

'use strict';

var cliDefaults = require('./cliDefaults'),
    extend = require('./deepExtend');

/**
 * Parse out Grunt options from command-line flags passed to the `grunt`
 * command.
 *
 * @param {external:Grunt} grunt Grunt object
 * @returns {grunt-niagara~Options} parsed out options
 */
module.exports = function parseOptions(grunt) {
  var gruntOptions = {},
      defaults = cliDefaults(grunt),
      flag;

  for (flag in defaults) {
    if (defaults.hasOwnProperty(flag)) {
      gruntOptions[flag] = grunt.option(flag);
    }
  }

  return extend(defaults, gruntOptions);
};
