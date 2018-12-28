/** @module */

'use strict';

/**
 * The `all` task runs ESLint, Karma, and JSDoc.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  var tasks = [],
      availableTasks = [ 'eslint', 'karma', 'jsdoc' ],
      i;

  for (i = 0; i < availableTasks.length; i++) {
    if (grunt.config(availableTasks[i])) {
      tasks.push(availableTasks[i]);
    }
  }

  grunt.registerTask('all', tasks);
};
