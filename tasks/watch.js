/** @module */

'use strict';

var watchConfig = require('../conf/watchConfig'),
    loadTasksRelative = require('../lib/loadTasksRelative');

/**
 * The `watch` task spins up a Niagara station (if necessary) and a Karma
 * server, then executes ESLint and Karma tests on every file save.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  if (!grunt.config('watch')) {
    return;
  }

  loadTasksRelative(grunt, 'grunt-contrib-watch');
  grunt.config('_watch', watchConfig(grunt));
  grunt.renameTask('watch', '_watch');

  var tasks = [];

  if (grunt.config('karma')) {
    tasks.push('karma:watch');
    tasks.push('karma-connect');
  }

  if (grunt.config('babel')) {
    tasks = [ 'babel:watch', 'copy' ].concat(tasks);
  }

  tasks.push('_watch');

  grunt.registerTask('watch', tasks);
};
