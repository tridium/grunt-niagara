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
      flag;

  for (flag in cliDefaults) {
    if (cliDefaults.hasOwnProperty(flag)) {
      gruntOptions[flag] = grunt.option(flag);
    }
  }

  return extend(cliDefaults, gruntOptions);
};