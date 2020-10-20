/* eslint-env node */

/** @module */

'use strict';

var Station = require('niagara-station'),
    server = require('niagara-test-server'),
    KarmaServer = require('karma').Server;

function runStation(stationConfig, cb) {
  if (stationConfig.stationName) {
    console.log("starting up station " + stationConfig.stationName + "...");
    Station.copyAndRun(stationConfig, cb);
  } else {
    cb();
  }
}

/**
 * Performs the actual work of starting up `niagara-station` and
 * `niagara-test-server` and running Karma tests.
 *
 * @param {Object} karmaConfig config for Karma server
 * @param {Object} stationConfig config for `niagara-station`
 * @param {Object} serverConfig config for `niagara-test-server`
 * @param {Function} cb callback when tests are complete
 */
module.exports = function (karmaConfig, stationConfig, serverConfig, cb) {
  function finish(exitCode) {
    if (cb) {
      var err = exitCode && new Error('Karma exited with code ' + exitCode);
      cb(err || null, exitCode);
    }
  }

  runStation(stationConfig, function (err, station) {

    if (err) {
      return cb(err);
    }

    console.log("starting up niagara-test-server...");

    server.start(serverConfig, function (err, server) {
      if (err) {
        return cb(err);
      }

      console.log("starting up Karma server...");
      
      var karmaServer = new KarmaServer(karmaConfig, function (exitCode) {
        if (station) {
          station.kill(function (err) {
            if (err) {
              console.error(err);
            }
            finish(exitCode);
          });
        } else {
          finish(exitCode);
        }
      });

      karmaServer.start();
    });
  });
};
