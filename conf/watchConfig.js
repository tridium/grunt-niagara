/** @module */

'use strict';

var extend = require('../lib/deepExtend');

/**
 * Sets up defaults for
 * [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch).
 *
 * Watch behavior will be to run JSHint and Karma tests upon every file change.
 *
 * @param {external:Grunt} grunt
 * @returns {Object} `watch` Grunt configuration object
 */
module.exports = function (grunt) {
  var oldConfig = grunt.config.getRaw('watch') || {},
    tasks = [],
    newConfig = {
      files: oldConfig.src,
      tasks: tasks
    };
  
  //TODO: why does grunt watch never log station output, even with logLevel: 'ALL'?

  if (grunt.config.getRaw('jshint')) {
    tasks.push('jshint:src');
  }

  if (grunt.config.getRaw('karma')) {
    tasks.push('karma:watch:run');
  }

  delete oldConfig.src;
  return extend(true, oldConfig, newConfig);
};