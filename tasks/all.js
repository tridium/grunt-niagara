/** @module */

'use strict';

/**
 * The `all` task runs ESLint, Karma, JSDoc, and Plato.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  var tasks = [],
      availableTasks = [ 'eslint', 'karma', 'jsdoc', 'plato' ],
      i;

  for (i = 0; i < availableTasks.length; i++) {
    if (grunt.config(availableTasks[i])) {
      tasks.push(availableTasks[i]);
    }
  }

  grunt.registerTask('all', tasks);
};
