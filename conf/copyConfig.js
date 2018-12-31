/* eslint-env node */

'use strict';

const { allConfigFiles, allJsFiles } = require('../lib/gruntSources');

/**
 * @param {IGrunt} grunt
 * @returns {object} configuration for `copy` task
 */
module.exports = function (grunt) {
  return {
    dist: {
      files: [ allConfigFiles().from('src/rc').to('build/src/rc') ]
    },
    karma: {
      files: [
        allConfigFiles().from('src/rc').to('build/karma/src/rc'),
        allJsFiles().from('srcTest/ext').to('build/karma/srcTest/ext')
      ]
    }
  };
};