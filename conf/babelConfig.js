/* eslint-env node */

'use strict';

const { getSourceMappings, toKarmaDir } = require('../lib/gruntSources');
const { extend } = require('lodash');
const deepExtend = require('../lib/deepExtend');
const path = require('path');

/**
 * @param {IGrunt} grunt
 * @returns {object} configuration for `babel` task
 */
module.exports = function (grunt) {
  let config = grunt.config.getRaw('babel') || {};

  grunt.option('coverage-preprocessors', false);

  const { source, test } = getSourceMappings(grunt);

  if (!source.dest.startsWith('build/src/')) {
    throw new Error('source files must transpile into build/src/');
  }

  if (!test.dest.startsWith('build/srcTest/')) {
    throw new Error('test files must transpile into build/srcTest/');
  }

  const defaults = {
    options: {
      presets: [ '@babel/preset-env' ],
      sourceType: 'unambiguous'
    },

    // for distribution, simply transpile all JS files into the build directory
    // to package directly into the jar.
    dist: {
      files: [ source.forProd(), test.forProd() ]
    },

    // when watching, generate sourcemaps so debugging in Chrome works.
    watch: {
      options: { sourceMap: true },
      files: [ source.forProd(), source.forKarma(), test.forKarma() ]
    },

    // for CI, generate coverage reports.
    coverage: {
      options: { plugins: [ 'istanbul' ] },
      files: [ source.forKarma() ]
    },

    // for CI, transpile specs *without* coverage reports.
    spec: {
      files: [ test.forKarma() ]
    },

    // for rjs build, we *only* want to compile out non-ES stuff like JSX.
    es: {
      options: { presets: [] }, /* disable preset-env */
      files: [ source.forRequireJs(), test.forRequireJs() ]
    }
  };

  return deepExtend({}, defaults, config);
};

/**
 * Configure Babel to only transpile the specified files on the next run.
 *
 * @param {IGrunt} grunt
 * @param {Array.<string>} changedSources
 */
module.exports.updateFromWatch = function (grunt, changedSources) {
  const { source, test } = getSourceMappings(grunt),
    configuredMappings = extend({}, source, test),
    sourceMapping = {};

  // map sources (which could be either source or test files) to their
  // configured destination folders.
  changedSources.forEach((changedSource) => {
    [ source, test ].forEach((mapping) => {
      const { cwd, dest, src } = mapping;
      if (grunt.file.match({}, src.map((s) => path.join(cwd, s)), changedSource).length) {
        // this source file lives under a configured transpilation source
        // directory. transpile it to its corresponding path within the
        // configured destination directory.

        const distFolder = changedSource.replace(cwd, dest);
        sourceMapping[distFolder] = changedSource;
        sourceMapping[toKarmaDir(distFolder)] = changedSource;
      }
    });
  });

  grunt.log.debug('changed source files: ' + JSON.stringify(changedSources, null, 2));
  grunt.log.debug('configured Babel mapping: ' + JSON.stringify(configuredMappings, null, 2));
  grunt.log.debug('new files to transpile: ' + JSON.stringify(sourceMapping, null, 2));

  grunt.config('babel.watch.files', sourceMapping);
};
