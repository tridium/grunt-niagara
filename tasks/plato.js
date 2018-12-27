/** @module */

'use strict';

var loadTasksRelative = require('../lib/loadTasksRelative'),
    platoConfig = require('../conf/platoConfig');

/**
 * The `plato` task generates code complexity analysis reports using Plato.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  if (!grunt.config('plato')) {
    return;
  }

  loadTasksRelative(grunt, 'grunt-plato');
  grunt.config('plato', platoConfig(grunt));
};
