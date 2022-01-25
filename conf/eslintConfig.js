/* eslint-env node */

/** @module */

'use strict';

const path = require('path'),
  parseOptions = require('../lib/parseOptions'),
  extend = require('../lib/deepExtend');

/**
 * Sets up defaults for
 * [gruntify-eslint](https://github.com/gyandeeps/gruntify-eslint).
 *
 * Will set up three tasks: `eslint:src` which simply runs ESLint on all sources
 * and outputs the results to console; `eslint:ci` which will output the results
 * in JUnit format to a file in `eslint-reports-dir`; and `eslint:fix` which
 * will attempt to automatically fix failures.
 *
 * @param {IGrunt} grunt
 * @returns {Object} configuration for `eslint` task
 */
module.exports = function (grunt) {
  const opts = parseOptions(grunt),
    moduleName = grunt.file.readJSON('package.json').name,
    oldConfig = grunt.config.getRaw('eslint') || {},
    src = oldConfig.src,
    configFile = path.join(__dirname, '..', '.eslintrc.json'),
    reportsDir = opts['jshint-reports-dir'] || opts['eslint-reports-dir'],
    outputFile = path.join(reportsDir, moduleName + '-eslint.xml');

  const newConfig = {
    ci: {
      src: src,
      options: { format: 'junit', outputFile }
    },
    fix: {
      src: src,
      options: { fix: true }
    },
    options: {
      configFile, useEslintrc: false
    }
  };

  return extend(true, newConfig, oldConfig);
};

module.exports.updateFromWatch = function (grunt, changedSources) {
  grunt.config('eslint.src', changedSources);
};
