/* eslint-env node */

/** @module */

'use strict';

const cliDefaults = require('./cliDefaults');
const extend = require('./deepExtend');
const fs = require('fs');
const { once } = require('lodash');

const CONFIGURABLE_PORTS = [
  'karma-server-port',
  'niagara-test-server-port',
  'station-fox-port',
  'station-foxs-port',
  'station-http-port',
  'station-https-port'
];

/**
 * Parse out Grunt options from command-line flags passed to the `grunt`
 * command.
 *
 * @param {IGrunt} grunt Grunt object
 * @returns {grunt-niagara~Options} parsed out options
 */
module.exports = function parseOptions(grunt) {
  var gruntOptions = {},
      fileOptions = {},
      defaults = cliDefaults(grunt),
      flag;

  for (flag in defaults) {
    if (defaults.hasOwnProperty(flag)) {
      gruntOptions[flag] = grunt.option(flag);
    }
  }

  var optionFile = grunt.option("options") || defaults["options"];
  if (fs.existsSync(optionFile)) {
    fileOptions = JSON.parse(fs.readFileSync(optionFile));
  }

  const options = extend(defaults, fileOptions, gruntOptions, {
    "chrome-flags": mergeChromeFlags(defaults["chrome-flags"], gruntOptions["chrome-flags"])
  });

  const portBump = Number(options['port-bump']) || 0;

  if (portBump) {
    CONFIGURABLE_PORTS.forEach((portOption) => {
      options[portOption] = Number(options[portOption]) + portBump;
    });

    options['override-station-ports'] = 'true';

    logPortBumpInfo(options);
  }

  return options;
};

const logPortBumpInfo = once((options) => {
  console.log('port-bump option specified; forcing the use of the following ports:');
  CONFIGURABLE_PORTS.forEach((portOption) => {
    console.log(`${ portOption }: ${ options[portOption] }`);
  });
});

function mergeChromeFlags(defaultChromeFlags, cliChromeFlags) {
  if (!cliChromeFlags) {
    return defaultChromeFlags;
  }

  defaultChromeFlags = defaultChromeFlags.split(/,\s*(?=--)/);
  cliChromeFlags = cliChromeFlags.split(/,\s*(?=--)/);

  defaultChromeFlags.forEach((defaultChromeFlag) => {
    const defaultFlagName = getFlagName(defaultChromeFlag);
    const specifiedOnCli = cliChromeFlags.find((cliChromeFlag) => getFlagName(cliChromeFlag) === defaultFlagName);

    if (!specifiedOnCli) {
      cliChromeFlags.push(defaultChromeFlag);
    }
  });

  return cliChromeFlags;
}

function getFlagName(pair) {
  const name = pair.split('=')[0];
  return name && name.trim();
}
