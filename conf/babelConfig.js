/* eslint-env node */

'use strict';

const { allJsFiles } = require('../lib/gruntSources');
const { flatten, forOwn, map } = require('lodash');
const extend = require('../lib/deepExtend');

/**
 * @param {IGrunt} grunt
 * @returns {object} configuration for `babel` task
 */
module.exports = function (grunt) {
  let config = grunt.config.getRaw('babel') || {};

  grunt.option('coverage-preprocessors', false);

  const {
    source = { 'src/rc': 'build/src/rc' },
    test = { 'srcTest/rc': 'build/srcTest/rc' }
  } = config;

  forOwn(source, destDir => {
    if (!destDir.startsWith('build/src/')) {
      throw new Error('source files must transpile into build/src/');
    }
  });

  forOwn(test, destDir => {
    if (!destDir.startsWith('build/srcTest/')) {
      throw new Error('test files must transpile into build/srcTest/');
    }
  });

  const defaults = {
    options: {
      presets: [ 'es2015-without-strict' ]
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

  return extend({}, defaults, config);
};

/**
 * @param {object} dirMap source dir -> dest dir mapping
 * @param {object} gruntSrc
 * @returns {Array.<object>} Grunt file config objects
 */
function toDistFolder(dirMap, gruntSrc) {
  return map(dirMap, (dest, src) => gruntSrc.from(src).to(dest));
}

/**
 * @param {object} dirMap source dir -> dest dir mapping
 * @param {object} gruntSrc
 * @returns {Array.<object>} Grunt file config objects
 */
function toKarmaFolder(dirMap, gruntSrc) {
  return map(dirMap, (dest, src) => gruntSrc.from(src).toKarma(dest));
}
