/* eslint-env node */

'use strict';

const extend = require('../lib/deepExtend');
const { getSourceMappings } = require('../lib/gruntSources');

/**
 * @param {IGrunt} grunt
 * @returns {object} configuration for `copy` task
 */
module.exports = function (grunt) {
  const copyConfig = grunt.config.getRaw('copy') || {};

  const { resources, testResources, ext, testExt, testBuiltJs } = getSourceMappings(grunt);
  const copyMappings = [ resources, testResources, ext, testExt, testBuiltJs ];

  return extend({
    dist: {
      files: copyMappings.map((mapping) => mapping.forProd())
    },
    es: {
      files: copyMappings.map((mapping) => mapping.forRequireJs())
    },
    karma: {
      files: copyMappings.map((mapping) => mapping.forKarma())
    }
  }, copyConfig);
};

