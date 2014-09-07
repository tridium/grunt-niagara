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
  var defaultJsdocPath = path.resolve(__dirname,
        '../node_modules/grunt-jsdoc/node_modules/jsdoc/jsdoc'),
      defaultTemplatePath = path.resolve(__dirname,
        '../node_modules/ink-docstrap/template'),

      oldConfig = grunt.config.getRaw('jsdoc') || {},
      src = oldConfig.src,
      newConfig = {
        dist : {
          src: src,
          jsdoc: defaultJsdocPath,
          options: {
            lenient: true,
            template: defaultTemplatePath,
            destination: 'src/jsdoc'
          }
        }
      };

  return extend(true, newConfig, oldConfig);
};