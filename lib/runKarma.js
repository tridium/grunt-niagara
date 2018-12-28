/* eslint-env node */

/** @module */

'use strict';

var extend = require('./deepExtend'),
    path = require('path'),
    stripAnsi = require('strip-ansi');

require('colors');

/**
 * Runs Karma tests.
 *
 * First, gets Karma configuration from the Grunt configuration, parses any
 * configuration file (`karma.options.configFile`), and creates the final
 * Karma configuration to be used. Any Karma options configured directly in
 * the Gruntfile will override options in the config file.
 *
 * If Karma is being run with the `run` target (`karma:run` task), it will
 * simply trigger a test run, assuming that the Karma server is already
 * started and listening.
 *
 * If Karma is being run in the background, as in the `watch` task, it will
 * start up the test station, Niagara test server, and Karma server in a
 * background task and wait for a `run` command.
 *
 * Otherwise, it will do a single run - spin up station and test server, do
 * a single runthrough of Karma tests, and then quit.
 *
 * @param {external:Grunt} grunt
 * @param {String} configName the selected Karma config, e.g. `ci` if running
 * task `karma:ci`
 * @param {Boolean} run true if should only trigger Karma to run - server must
 * already be running (used for watch task)
 * @param {Function} cb called when done - if unit tests fail, the error will
 * be passed as the first argument
 * @see lib/runKarmaInBackground.js
 */
module.exports = function (grunt, configName, run, cb) {

  grunt.log.writeln('Running tests in Karma.');

  /*
   * Support some extra command line flags that allow specific targeting of
   * individual specs. These vars get injected into the browser's global
   * `testGlobals` object, and then referenced by
   * `niagara-test-server/public/karmaUtils`.
   */
  var testOnly = grunt.option('testOnly'),
      testNever = grunt.option('testNever');

  grunt.config('niagara.testServer.globals.testOnly', testOnly);
  grunt.config('niagara.testServer.globals.testNever', testNever);

  var karmaTest = require('./startKarmaServer'),

      karmaConfig = grunt.config('karma') || {},

      // these options are shared across all karma configs...
      sharedKarmaOptions = karmaConfig.options || {},

      // these options are specific to this karma config, e.g. 'ci'
      karmaOptions = extend(sharedKarmaOptions, karmaConfig[configName] || {});

  if (karmaOptions.configFile) {
    karmaOptions.configFile = path.resolve(karmaOptions.configFile);
    karmaOptions.configFile = grunt.template.process(karmaOptions.configFile);
  }

  var configFile = karmaOptions.configFile,

      // these options come from the config file.
      parsedKarmaOptions = require('karma/lib/config').parseConfig(configFile, {
        basePath: path.dirname(path.resolve('package.json'))
      }),

      serverConfig = grunt.config('niagara.testServer') || {},

      stationConfig = grunt.config('niagara.station') || {};

  // options configured directly in the gruntfile override those configured
  // in the config file.
  karmaOptions = extend(parsedKarmaOptions, karmaOptions);


  //now the good stuff.
  if (run) {
    //run only - we're running in watch mode so server is already started
    require('karma').runner.run(karmaOptions, cb);
  } else if (karmaOptions.background) {

    console.log('Starting up Karma in background. Please wait a moment...');

    // start in background mode - we are just starting up in watch mode, so
    // start the station and the karma server and await a run command
    // this pattern copied and modified from grunt-karma task
    var spawn = grunt.util.spawn({
      cmd: 'node',
      args: [
        path.join(__dirname, 'runKarmaInBackground.js'),
        JSON.stringify(karmaOptions),
        JSON.stringify(stationConfig),
        JSON.stringify(serverConfig)
      ]
    }, function (err) {
      console.log(err);
      cb(err);
    });

    var started = false;

    spawn.stdout.on('data', function (data) {
      String(data).split('\n').forEach(function (str) {
        var noAnsi = stripAnsi(str); //karma out may include ansi color escapes

        if (!noAnsi) { return; }

        // print station log, as output by karma.
        // TODO: this may conceivably break if a custom log function is passed
        // to the niagara-station config.
        if (noAnsi.match(/^station \w+:/)) {
          console.log(str);
        }

        if (noAnsi.toLowerCase().indexOf('connected on socket') >= 0) {
          if (!started) { cb(); }
          started = true;
        }
      });
    });

    spawn.stderr.on('data', function (data) {
      var msg = '[STATION ERR] ' + data;
      console.log(msg.red);
    });
  } else {
    // single run - run tests, then quit
    karmaTest(karmaOptions, stationConfig, serverConfig, cb);
  }
};
