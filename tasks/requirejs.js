/* eslint-env node */

/** @module */

'use strict';

var requirejsConfig = require('../conf/requirejsConfig'),
    loadTasksRelative = require('../lib/loadTasksRelative');

/**
 * The `requirejs` task will delay execution until it can use
 * `niagara-moduledev` to resolve any inter-module dependencies (e.g. Handlebars
 * from the `js` module) that will be needed during the build.
 * 
 * These are specified using the nonstandard `moduleResources` property on the
 * `requirejs` config options.
 *
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {
  if (!grunt.config('requirejs')) {
    return;
  }

  const transpilingEnabled = !!grunt.config('babel');
  
  loadTasksRelative(grunt, 'grunt-contrib-requirejs');
  
  grunt.renameTask('requirejs', 'requirejs-sync');

  grunt.registerTask('requirejs', 'Build a RequireJS project.', function (buildName = 'src') {
    let done = this.async();
    return requirejsConfig(grunt)
      .then(config => {
        grunt.config.merge({
          "requirejs-sync": config
        });

        grunt.log.debug('requirejs configuration:');
        grunt.log.debug(JSON.stringify(grunt.config.get('requirejs-sync'), null, 2));

        grunt.task.run('requirejs-sync');

        if (transpilingEnabled) {
          grunt.task.run('babel:builtfile_' + buildName);
          grunt.task.run('uglify:builtfile_' + buildName);
        }
        
        done();
      })
      .catch(err => { console.error(err); return done(false); });
  });
};
