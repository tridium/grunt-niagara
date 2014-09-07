/**
 * Grunt object.
 * @external Grunt
 * @see http://gruntjs.com/api/grunt
 */

'use strict';

var extend = require('./lib/deepExtend');

module.exports = function(grunt) {

  var jshintDefaults = extend(require('./conf/defaults/jshintDefaults'), {
        node: true
      }),
      SRC_FILES = [
        'Gruntfile.js',
        'conf/**/*.js',
        'lib/**/*.js',
        'tasks/**/*.js'
      ];

  // Project configuration.
  grunt.initConfig({
    jshint: {
      src: SRC_FILES,
      options: jshintDefaults
    },
    jsdoc: {
      src: SRC_FILES.concat([ 'README.md' ])
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // By default, lint.
  grunt.registerTask('default', ['jshint']);

};
