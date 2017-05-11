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
  
  loadTasksRelative(grunt, 'grunt-contrib-requirejs');
  
  grunt.renameTask('requirejs', 'requirejs-sync');

  grunt.registerTask('requirejs', 'Build a RequireJS project.', function () {
    let done = this.async();
    return requirejsConfig(grunt)
      .then(config => {
        grunt.config.merge({
          "requirejs-sync": config
        });
        grunt.log.debug('requirejs configuration:');
        grunt.log.debug(JSON.stringify(grunt.config.get('requirejs-sync'), null, 2));
        grunt.task.run('requirejs-sync');
        done();
      })
      .catch(err => { console.error(err); return done(false); });
  });
};