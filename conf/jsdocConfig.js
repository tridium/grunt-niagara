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
 * [ink-docstrap](https://github.com/terryweiss/docstrap),
 * `lenient` will set set to true, and docs will go in `src/jsdoc`.
 *
 * @param {external:Grunt} grunt
 * @returns {Object} `jsdoc` Grunt configuration object
 */
module.exports = function (grunt) {
  var defaultJsdocPath = path.resolve(require.resolve('grunt-jsdoc'), '..', 'jsdoc', 'jsdoc'),
      defaultTemplatePath = path.resolve(require.resolve('ink-docstrap'), '..'),

      oldConfig = grunt.config.getRaw('jsdoc') || {},
      src = oldConfig.src,
      newConfig = {
        options: {
          lenient: true,
          recurse: true,
          template: defaultTemplatePath,
          destination: 'src/jsdoc'
        },
        dist: {
          src: src,
          jsdoc: defaultJsdocPath
        }
      };

  return extend(true, newConfig, oldConfig);
};
