/** @module */

'use strict';

var moduledev = require('niagara-moduledev'),
    requirejsConfig = require('../conf/requirejsConfig'),
    loadTasksRelative = require('../lib/loadTasksRelative');

/**
 * The `requirejs` task will delay execution until it can use
 * `niagara-moduledev` to resolve any inter-module dependencies (e.g. Handlebars
 * from the `js` module) that will be needed during the build.
 * 
 * These are specified using the nonstandard `moduleResources` property on the
 * `requirejs` config options.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  if (!grunt.config('requirejs')) {
    return;
  }
  
  var config = requirejsConfig(grunt),
      moduleResources = config.options.moduleResources;

  loadTasksRelative(grunt, 'grunt-contrib-requirejs');
  
  grunt.config('requirejs-sync', config);
  grunt.renameTask('requirejs', 'requirejs-sync');

  grunt.registerTask('requirejs', 'Build a RequireJS project.', function () {
    var done = this.async();
    moduledev.fromFile(function (err, md) {
      if (err) { console.error(err); return done(false); }
      
      md.getRequireJsPaths(moduleResources, function (err, paths) {
        if (err) { console.error(err); return done(false); }
        
        grunt.config.merge({
          "requirejs-sync": { options: { paths: paths } }
        });
        grunt.task.run('requirejs-sync');
        done();
      });
    });
  });
};