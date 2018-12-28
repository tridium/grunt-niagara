/* eslint-env node */

'use strict';

const { allJsFiles } = require('../lib/gruntSources');
const extend = require('../lib/deepExtend');

module.exports = function (grunt) {
  let config = grunt.config.getRaw('babel') || {};

  grunt.option('coverage-preprocessors', false);

  const defaults = {
    options: {
      presets: [ 'es2015-without-strict' ]
    },
    // for distribution, simply transpile all JS files into the build directory
    // to package directly into the jar.
    dist: {
      files: [
        allJsFiles().from('src/rc').to('build/src/rc'),
        allJsFiles().from('srcTest/rc').to('build/srcTest/rc')
      ]
    },
    // when watching, generate sourcemaps so debugging in Chrome works.
    watch: {
      options: { sourceMap: true },
      files: [
        allJsFiles().from('src/rc').to('build/karma/src/rc'),
        allJsFiles().from('srcTest/rc').to('build/karma/srcTest/rc')
      ]
    },
    // for CI, generate coverage reports.
    coverage: {
      options: { plugins: [ 'istanbul' ] },
      files: [ allJsFiles().from('src/rc').to('build/karma/src/rc') ]
    },
    // transpile specs only.
    spec: {
      files: [
        allJsFiles().from('srcTest/rc').to('build/karma/srcTest/rc')
      ]
    }
  };

  return extend({}, defaults, config);
};
