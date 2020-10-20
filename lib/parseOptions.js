/* eslint-env node */

/** @module */

'use strict';

var cliDefaults = require('./cliDefaults'),
    extend = require('./deepExtend'),
    fs = require('fs');

/**
 * Parse out Grunt options from command-line flags passed to the `grunt`
 * command.
 *
 * @param {IGrunt} grunt Grunt object
 * @returns {grunt-niagara~Options} parsed out options
 */
module.exports = function parseOptions(grunt) {
  var gruntOptions = {},
      fileOptions = {},
      defaults = cliDefaults(grunt),
      flag;

  for (flag in defaults) {
    if (defaults.hasOwnProperty(flag)) {
      gruntOptions[flag] = grunt.option(flag);
    }
  }

  var optionFile = grunt.option("options") || defaults["options"];
  if (fs.existsSync(optionFile)) {
    fileOptions = JSON.parse(fs.readFileSync(optionFile));
  }

  return extend(defaults, fileOptions, gruntOptions);
};
