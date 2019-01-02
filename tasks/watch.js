/* eslint-env node */

/** @module */

'use strict';

var watchConfig = require('../conf/watchConfig'),
    loadTasksRelative = require('../lib/loadTasksRelative');

/**
 * The `watch` task spins up a Niagara station (if necessary) and a Karma
 * server, then executes ESLint and Karma tests on every file save.
 *
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {
  if (!grunt.config('watch')) {
    return;
  }

  loadTasksRelative(grunt, 'grunt-contrib-watch');

  // rename to "watchForChange" b/c we hijack the default watch task list,
  // and the default watch task always prints last even though it becomes a
  // no-op. just reads nicer to the user
  grunt.config('watchForChange', watchConfig(grunt));
  grunt.renameTask('watch', 'watchForChange');

  var tasks = [];

  if (grunt.config('karma')) {
    tasks.push('karma:watch');
    tasks.push('karma-connect');
  }

  tasks.push('watchForChange');

  grunt.registerTask('watch', tasks);
};
