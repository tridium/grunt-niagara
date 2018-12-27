/**
 * Grunt object.
 * @external Grunt
 * @see http://gruntjs.com/api/grunt
 */

'use strict';

module.exports = function (grunt) {

  var SRC_FILES = [
        'Gruntfile.js',
        'conf/**/*.js',
        'lib/**/*.js',
        'tasks/**/*.js'
      ];

  // Project configuration.
  grunt.initConfig({
    eslint: {
      src: SRC_FILES,
      options: { configFile: '.eslintrc.json', envs: [ 'node' ] }
    },
    jsdoc: {
      src: SRC_FILES.concat([ 'README.md' ])
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('gruntify-eslint');

  // By default, lint.
  grunt.registerTask('default', [ 'eslint' ]);

};
