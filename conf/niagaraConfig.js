/* eslint-env node */

/** @module */

'use strict';

var path = require('path'),
    parseOptions = require('../lib/parseOptions'),
    extend = require('../lib/deepExtend');

/**
 * Sets up defaults for `niagara-station` and `niagara-test-station`.
 *
 * If `override-station-ports` is set, will configure `niagara-station` to
 * inject HTTP and FOX ports into `config.bog` before starting up the station.
 *
 * @param {external:Grunt} grunt
 * @returns {Object} `niagara` Grunt configuration object
 */
module.exports = function (grunt) {
  var opts = parseOptions(grunt),
      stationCwd = opts['station-cwd'],
      stationsDir = opts['stations-dir'],
      niagaraUserHome = opts['niagara-user-home'],
      testServerPort = opts['niagara-test-server-port'],
      stationName = opts['station-name'],
      httpPort = opts['station-http-port'],
      httpsPort = opts['station-https-port'],
      foxPort = opts['station-fox-port'],
      foxsPort = opts['station-foxs-port'],
      overridePorts = opts['override-station-ports'],
      logLevel = opts['station-log-level'],
      bogOverrides,
      oldConfig = grunt.config.getRaw('niagara') || {},
      newConfig;

  if (String(overridePorts) === 'true') {
    bogOverrides = {
      httpPort: httpPort,
      httpsPort: httpsPort,
      foxPort: foxPort,
      foxsPort: foxsPort
    };
  }

  newConfig = {
    testServer: {
      moduleDevFilePath: path.join(niagaraUserHome, 'etc', 'moduledev.properties'),
      host: '127.0.0.1',
      port: testServerPort
    }
  };

  if (grunt.config.getRaw('niagara.station')) {
    var stationDebug = String(opts['station-debug']).toLowerCase() === 'true',
        stationDebugSuspend = String(opts['station-debug-suspend']).toLowerCase() === 'true' ? 'y' : 'n',
        stationDebugPort = opts['station-debug-port'] || '8000',
        jvmArgs = stationDebug ? [ '-Xrunjdwp:transport=dt_socket,address=' +
          stationDebugPort + ',server=y,suspend=' + stationDebugSuspend ] : [];

    newConfig.station = {
      cwd: stationCwd,
      stationsDir: stationsDir,
      command: 'station',
      stationName: stationName,
      bogOverrides: bogOverrides,
      logLevel: logLevel,
      jvmArgs: jvmArgs
    };
  }

  return extend(true, newConfig, oldConfig);
};
