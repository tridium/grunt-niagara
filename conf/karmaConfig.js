/** @module */

'use strict';

var parseOptions = require('../lib/parseOptions'),
    extend = require('../lib/deepExtend'),
    path = require('path'),
    karmaDefaults = require('./defaults/karmaDefaults');

/**
 * Turns on code coverage reports for a Karma configuration object.
 *
 * @private
 * @inner
 * @param {external:Grunt} grunt
 * @param {grunt-niagara~Options} opts parsed grunt options
 * @param {Object} obj object to extend
 * @returns {Object} options object configured for Karma to run code coverage
 * reports
 */
function enableCodeCoverage(grunt, opts, obj) {
  var pkg = grunt.file.readJSON('package.json');

  return extend(true, obj, {
    preprocessors: {
      '**/src/rc/**/*.js': 'coverage'
    },
    reporters: [ 'progress', 'junit', 'coverage' ],
    coverageReporter: {
      type: 'html',
      dir: path.resolve(opts['coverage-reports-dir'] + '/' + pkg.name)
    }
  });
}

/**
 * Sets up defaults for
 * [Karma](https://github.com/karma-runner/karma).
 *
 * Will create three tasks: `karma` which will start the Karma server, perform
 * a single runthrough, and then quit; `karma:run` which will assume that a
 * Karma server has already started and perform one runthrough (for use with
 * a `watch` task); and `karma:ci` which is the same as `karma` but with code
 * coverage reports turned on.
 *
 * @param {external:Grunt} grunt
 * @returns {Object} `karma` Grunt configuration object
 */
module.exports = function (grunt) {
  var opts = parseOptions(grunt),
      pkg = grunt.file.readJSON('package.json'),
      pkgName = pkg.name,
      karmaOptions = grunt.config.getRaw('karma.options'),
      testServerPort = opts['niagara-test-server-port'],
      junitDir = opts['junit-reports-dir'],
      stationHost = opts['station-host'],
      stationPort = opts['station-http-port'],

      defaultOptions = extend(true, {}, karmaDefaults, {
        junitReporter: {
          outputFile: path.resolve(junitDir + '/' + pkgName + '.xml')
        },

        browsers: opts.browsers.split(','),

        proxies: {
          '/niagara-test-server/': 'http://localhost:' + testServerPort + '/public/'
        }
      }, karmaOptions),

      karmaPort = grunt.config.getRaw('karma.options.port') || karmaDefaults.port,
      karmaHostname = grunt.config.get('karma.options.hostname') || karmaDefaults.hostname,

      results;

  //ensure that requests for module files go through Karma so it can
  //apply the coverage preprocessing.
  defaultOptions.proxies['/module/' + pkgName + '/rc/'] =
    'http://' + karmaHostname + ':' + karmaPort + '/base/src/rc/';
  defaultOptions.proxies['/module/' + pkgName + 'Test/rc/'] =
    'http://' + karmaHostname + ':' + karmaPort + '/base/srcTest/rc/';


  if (grunt.config('niagara.station')) {
    //we're starting up a station, so just let the station serve up everything.
    defaultOptions.proxies['/'] = 'http://' + stationHost + ':' + stationPort + '/';
  } else {
    //no station, so let niagara-test-server/niagara-moduledev serve up files.
    defaultOptions.proxies['/module/'] = 'http://localhost:' + testServerPort + '/module/';
  }

  //always generate coverage if --coverage flag is set
  if (String(opts.coverage) === 'true') {
    defaultOptions = enableCodeCoverage(grunt, opts, defaultOptions);
  }

  results = {
    options: defaultOptions,

    watch: {
      // in watch mode, the background flag will let us spawn off a child
      // process which will start up the station, niagara test server, and karma
      // runner.
      background: true,
      reporters: [ 'dots' ], //https://github.com/karma-runner/karma/issues/1411
      singleRun: false
    },

    // always enable code coverage for CI
    ci: extend(true, enableCodeCoverage(grunt, opts, {}), {
      //turn on html reporting as well
      reporters: [
        'progress',
        'junit',
        //'html', //https://github.com/dtabuenc/karma-html-reporter/issues/25
        'coverage'
      ],
      htmlReporter: {
        outputDir: path.resolve(junitDir + '/karma_html/' + pkgName)
      }
    }, grunt.config.getRaw('karma.ci'))
  };

  return extend({}, results, grunt.config.getRaw('karma'));
};