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

  grunt.registerTask('runKarma', 'Run tests in Karma', function (type) {
    const opts = parseOptions(grunt);
    const done = this.async();

    runKarma(grunt, type, this.flags.run, function (err) {
      if (err) {
        grunt.log.writeln("Error running Karma tests: " + err);
      }

      grunt.log.writeln("\n\nSee test results at: " + opts['junit-reports-dir']);

      return done(!err);
    });
  });

  grunt.registerTask('karma', function () {
    const args = Object.keys(this.flags).join(':');
    let tasks = [ 'runKarma' + (args ? ':' + args : '') ];

    if (grunt.config('babel') && !args) {
      const opts = parseOptions(grunt);
      if (String(opts.coverage) === 'true') {
        tasks = [ 'babel:coverage', 'babel:spec', 'copy:karma' ].concat(tasks);
      } else {
        tasks = [ 'babel:watch', 'babel:spec', 'copy:karma' ].concat(tasks);
      }
    }

    grunt.task.run(tasks);
  });
};
