/* eslint-env node */

'use strict';

const { allJsFiles, toKarmaDir } = require('../lib/gruntSources');
const { each, extend, flatten, forOwn, map } = require('lodash');
const deepExtend = require('../lib/deepExtend');

/**
 * @param {IGrunt} grunt
 * @returns {object} configuration for `babel` task
 */
module.exports = function (grunt) {
  let config = grunt.config.getRaw('babel') || {};

  grunt.option('coverage-preprocessors', false);

  const { source, test } = getSourceDirs(grunt);

  forOwn(source, (destSrc, destDir) => {
    if (!destDir.startsWith('build/src/')) {
      throw new Error('source files must transpile into build/src/');
    }
  });

  forOwn(test, (destSrc, destDir) => {
    if (!destDir.startsWith('build/srcTest/')) {
      throw new Error('test files must transpile into build/srcTest/');
    }
  });

  const defaults = {
    options: {
      presets: [ '@babel/preset-env' ],
      sourceType: 'unambiguous'
    },

    // for distribution, simply transpile all JS files into the build directory
    // to package directly into the jar.
    dist: {
      files: flatten([
        toDistFolder(source, allJsFiles()),
        toDistFolder(test, allJsFiles())
      ])
    },

    // when watching, generate sourcemaps so debugging in Chrome works.
    watch: {
      options: { sourceMap: true },
      files: flatten([
        toKarmaFolder(source, allJsFiles()),
        toKarmaFolder(test, allJsFiles())
      ])
    },

    // for CI, generate coverage reports.
    coverage: {
      options: { plugins: [ 'istanbul' ] },
      files: toKarmaFolder(source, allJsFiles())
    },

    // for CI, transpile specs *without* coverage reports.
    spec: {
      files: toKarmaFolder(test, allJsFiles())
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
  const { source, test } = getSourceDirs(grunt),
    configuredMappings = extend({}, source, test),
    sourceMapping = {};

  // map sources (which could be either source or test files) to their
  // configured destination folders.
  changedSources.forEach((changedSource) => {
    each(configuredMappings, (configuredSrc, configuredDest) => {
      if (changedSource.startsWith(configuredSrc)) {
        // this source file lives under a configured transpilation source
        // directory. transpile it to its corresponding path within the
        // configured destination directory.

        const distFolder = changedSource.replace(configuredSrc, configuredDest);
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

function getSourceDirs(grunt) {
  const {
    source = { 'build/src/rc': 'src/rc' },
    test = { 'build/srcTest/rc': 'srcTest/rc' }
  } = grunt.config.getRaw('babel') || {};
  return { source, test };
}

/**
 * @param {object} dirMap source dir -> dest dir mapping
 * @param {object} gruntSrc
 * @returns {Array.<object>} Grunt file config objects
 */
function toDistFolder(dirMap, gruntSrc) {
  return map(dirMap, (src, dest) => gruntSrc.from(src).to(dest));
}

/**
 * @param {object} dirMap source dir -> dest dir mapping
 * @param {object} gruntSrc
 * @returns {Array.<object>} Grunt file config objects
 */
function toKarmaFolder(dirMap, gruntSrc) {
  return map(dirMap, (src, dest) => gruntSrc.from(src).toKarma(dest));
}
