/* eslint-env node */

/** @module */

'use strict';

var extend = require('../lib/deepExtend');

/**
 * Sets up defaults for
 * [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch).
 *
 * Watch behavior will be to run ESLint and Karma tests upon every file change.
 *
 * @param {IGrunt} grunt
 * @returns {Object} configuration for `watch` task
 */
module.exports = function (grunt) {
  var oldConfig = grunt.config.getRaw('watch') || {},
    tasks = [],
    newConfig = {
      files: oldConfig.src,
      tasks: [ '_prewatch' ]
    };
  
  grunt.registerTask('_prewatch', 'Task filter run before watch task.',
    function () {
      if (oldConfig.hasOwnProperty('tasks')) {
        if (Array.isArray(oldConfig.tasks)) {
          grunt.task.run(oldConfig.tasks.concat(tasks));
        } else if (typeof oldConfig.tasks === 'function') {
          grunt.task.run(oldConfig.tasks(tasks));
        } else {
          grunt.fail.warn('grunt.config.watch.tasks must be either an Array or a function.');
        }
      } else {
        grunt.task.run(tasks);
      }
    });

  if (grunt.config.getRaw('karma')) {
    tasks.push('karma:watch:run');
  }

  if (grunt.config.getRaw('eslint')) {
    tasks.push('eslint:src');
  }

  delete oldConfig.src;
  return extend(true, oldConfig, newConfig);
};
