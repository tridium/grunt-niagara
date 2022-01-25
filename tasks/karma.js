/* eslint-env node */

/** @module */

'use strict';

const parseOptions = require('../lib/parseOptions');
const niagaraConfig = require('../conf/niagaraConfig');
const karmaConfig = require('../conf/karmaConfig');
const runKarma = require('../lib/runKarma');
const { once } = require('lodash');

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

    const { browsers } = opts;
    if (browsers.match(/Chrome/) || browsers.match(/Chromium/)) {
      if (!getChromeBin(grunt)) {
        throw new Error('Chrome/Chromium selected as browser, but could not ' +
          'find corresponding executable. Visit ' +
          'https://github.com/tridium/grunt-niagara/tree/dev#karma for more information.');
      }
    }

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


const getChromeBin = once((grunt) => {
  let chromeBin = process.env.CHROME_BIN;
  if (chromeBin) {
    grunt.log.debug('Found Chrome executable path from CHROME_BIN ' +
      'environment variable: ' + chromeBin);
    return chromeBin;
  }

  chromeBin = process.env.CHROMIUM_BIN;
  if (chromeBin) {
    grunt.log.debug('Found Chromium executable path from CHROMIUM_BIN ' +
      'environment variable: ' + chromeBin);
    return chromeBin;
  }

  chromeBin = process.env.CHROME_CANARY_BIN;
  if (chromeBin) {
    grunt.log.debug('Found Chrome Canary executable path from CHROME_CANARY_BIN ' +
      'environment variable: ' + chromeBin);
    return chromeBin;
  }

  try {
    chromeBin = require('puppeteer').executablePath();
    process.env.CHROME_BIN = chromeBin;
    grunt.log.debug('Found Chrome executable path from puppeteer: ' + chromeBin);
    return chromeBin;
  } catch (ignore) {}
});
