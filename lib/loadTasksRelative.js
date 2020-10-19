/** @module */

'use strict';

var path = require('path'),
  overrideOptions = require('./overrideOptions');

/**
 * grunt-contrib-jshint foiled my plans and removed the "main" entry from
 * package.json, which meant require.resolve('grunt-contrib-jshint') started
 * breaking. Let's just assume that all Grunt tasks have a Gruntfile and look
 * for that instead. Safe assumption right? (Not a safe assumption.
 * package.json it is.)
 *
 * @param moduleName name of grunt module we want to load tasks from
 * @returns {String} path to the directory holding that grunt module
 */
function resolveGruntDir(moduleName) {
  if (moduleName === "grunt-niagara") {
    return path.dirname(__dirname);
  }
  try {
    return path.dirname(require.resolve(moduleName + '/package.json'));
  } catch (e) {
    return path.dirname(require.resolve(moduleName));
  }
}

/**
 * Loads tasks from a Grunt plugin, but resolves the plugin relative to
 * `grunt-niagara` rather than from the calling project. This allows projects
 * using `grunt-niagara` just to declare a dependency on `grunt-niagara` itself
 * rather than also having to declare dependencies in `grunt-jsdoc`,
 * `grunt-karma` etc.
 *
 * @param {external:Grunt} grunt
 * @param {String} moduleName the name of the Grunt plugin to load tasks from
 */
module.exports = function (grunt, moduleName) {
  grunt.loadTasks(resolveGruntDir(moduleName) + '/tasks');
  overrideOptions(grunt);
};
