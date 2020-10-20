/* eslint-env node */

/**
 * Script to start up a Karma server in a spawned background process.
 *
 * @file
 */

'use strict';

var startKarmaServer = require('./startKarmaServer'),
    karmaConfig = {},
    stationConfig = {},
    serverConfig = {};

try {
  karmaConfig = JSON.parse(process.argv[2]);
  stationConfig = JSON.parse(process.argv[3]);
  serverConfig = JSON.parse(process.argv[4]);

  karmaConfig.singleRun = false;

  startKarmaServer(karmaConfig, stationConfig, serverConfig, function (err, exitCode) {
    if (err) {
      console.error(err);
    }
    process.exit(exitCode);
  });
} catch (e) {
  console.error(e);
}

