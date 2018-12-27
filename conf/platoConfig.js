/** @module */

'use strict';

var parseOptions = require('../lib/parseOptions'),
    extend = require('../lib/deepExtend');

/**
 * Sets up defaults for
 * [grunt-plato](https://github.com/jsoverson/grunt-plato).
 *
 * JSHint will be disabled (it's already covered by the `eslint` task) and
 * build/built files will be excluded.
 *
 * @param {external:Grunt} grunt
 * @returns {Object} `plato` Grunt configuration object
 */
module.exports = function (grunt) {
  var opts = parseOptions(grunt),
      platoFiles = {},
      pkg = grunt.file.readJSON('package.json'),
      oldConfig = grunt.config.getRaw('plato') || {},
      src = oldConfig.src,
      newConfig = {};

  platoFiles[opts['complexity-reports-dir']] = src;

  newConfig[pkg.name] = {
    options: {
      jshint: false,
      exclude: oldConfig.exclude || /\.buil[dt]\..*\.js$/
    },
    files: platoFiles
  };

  delete oldConfig.src;

  return extend(true, oldConfig, newConfig);
};
