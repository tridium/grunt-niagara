/** @module */

'use strict';

var parseOptions = require('../lib/parseOptions'),
    jshintJUnitReporter = require('jshint-junit-reporter'),
    extend = require('../lib/deepExtend'),
    jshintDefaults = require('./defaults/jshintDefaults');

/**
 * Sets up defaults for
 * [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint).
 *
 * Will set up two tasks: `jshint:src` which simply runs JSHint on all sources
 * and outputs the results to console; and `jshint:ci` which will output the
 * results in JUnit format to a file in `jshint-reports-dir`.
 *
 * @param {external:Grunt} grunt
 * @returns {Object} `jshint` Grunt configuration object
 */
module.exports = function (grunt) {
  var opts = parseOptions(grunt),
      pkg = grunt.file.readJSON('package.json'),
      oldConfig = grunt.config.getRaw('jshint') || {},
      src = oldConfig.src,
      newConfig = {
        ci: {
          src: src,
          options: {
            reporter: jshintJUnitReporter,
            reporterOutput: opts['jshint-reports-dir'] + '/' +
              pkg.name + '-jshint.xml'
          }
        },
        options: jshintDefaults
      };

  return extend(true, newConfig, oldConfig);
};