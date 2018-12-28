/* eslint-env node */

/** @module */

'use strict';

var parseOptions = require('../lib/parseOptions'),
    niagaraConfig = require('../conf/niagaraConfig'),
    karmaConfig = require('../conf/karmaConfig'),
    runKarma = require('../lib/runKarma');

/**
 * The `karma` task runs unit tests using Karma. `karma:ci` also generates
 * code coverage reports.
 *
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {
  if (!grunt.config('karma')) {
    return;
  }

  grunt.config('niagara', niagaraConfig(grunt));

  grunt.config('karma', karmaConfig(grunt));

  grunt.registerTask('karma', 'Run tests in Karma', function (type) {
    var opts = parseOptions(grunt),
        done = this.async();

    runKarma(grunt, type, this.flags.run, function (err) {
      if (err) {
        grunt.log.writeln("Error running Karma tests: " + err);
      }

      grunt.log.writeln("\n\nSee test results at: " + opts['junit-reports-dir']);

      return done(!err);
    });
  });
};
