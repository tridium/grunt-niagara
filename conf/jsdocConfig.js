/* eslint-env node */

/**
 * @module conf/jsdocConfig
 */

'use strict';

var extend = require('../lib/deepExtend'),
    path = require('path');

/**
 * Sets up defaults for
 * [grunt-jsdoc](https://github.com/krampstudio/grunt-jsdoc-plugin).
 * Documentation will be generated using
 * [docdash](https://github.com/clenemt/docdash),
 * `lenient` will set set to true, and docs will go in `src/jsdoc`.
 *
 * @param {IGrunt} grunt
 * @returns {Object} configuration for `jsdoc` task
 */
module.exports = function (grunt) {
  var defaultJsdocPath = path.resolve(require.resolve('grunt-jsdoc'), '..', 'jsdoc', 'jsdoc'),
      defaultTemplatePath = path.resolve(require.resolve('docdash'), '..'),
      oldConfig = grunt.config.getRaw('jsdoc') || {},
      src = oldConfig.src,
      newConfig = {
        options: {
          lenient: true,
          recurse: true,
          template: defaultTemplatePath,
          destination: 'build/src/jsdoc'
        },
        dist: {
          src: src,
          jsdoc: defaultJsdocPath
        }
      };

  return extend(true, newConfig, oldConfig);
};
