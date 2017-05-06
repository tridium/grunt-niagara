/** @module */

'use strict';

var extend = require('../lib/deepExtend'),
    requirejsDefaults = require('./defaults/requirejsDefaults');

/**
 * Sets up defaults for
 * [grunt-contrib-requirejs](https://github.com/gruntjs/grunt-contrib-requirejs).
 *
 * @param {Grunt} grunt
 * @returns {Object} `requirejs` Grunt configuration object
 */
module.exports = function (grunt) {
  var oldConfig = grunt.config.getRaw('requirejs') || {},
      newConfig = {
        options: requirejsDefaults
      };

  return extend(true, newConfig, oldConfig);
};
