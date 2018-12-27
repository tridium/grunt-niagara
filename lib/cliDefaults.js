'use strict';

/**
 * Documenting Niagara Grunt plugin.
 * @namespace grunt-niagara
 */

/**
 * Gruntfile options that can be configured as command line flags.
 *
 * @typedef {Object} grunt-niagara~Options
 * @property {String} niagara-home Niagara home directory
 * @property {String} niagara-user-home Niagara user home directory
 * @property {String} station-cwd directory to run a station from
 * @property {String} stations-dir directory where station files live
 * @property {String} station-name the name of the station to start
 * @property {String} station-host the hostname of the station
 * @property {Number} station-http-port the HTTP port of the station
 * @property {Number} station-fox-port the FOX port of the station
 * @property {Boolean} override-station-ports true to inject HTTP/FOX ports
 * into config.bog before starting station
 * @property {Number} niagara-test-server-port the port niagara-test-server
 * uses
 * @property {String} junit-reports-dir directory for JUnit test reports
 * @property {String} eslint-reports-dir directory for ESLint results
 * @property {String} complexity-reports-dir directory for Plato reports
 * @property {Boolean} coverage true if coverage reports should be generated
 * @property {String} coverage-reports-dir directory for Istanbul reports
 * @property {String} browsers browsers to run tests in
 */

var fs = require('fs'),
    path = require('path'),
    pkg = JSON.parse(fs.readFileSync('package.json', { encoding: 'UTF-8' })),
    name = pkg.name,
    moduleName = name.replace(/-(ux|rt|wb|se|doc)$/, ''),
    projectDir = path.dirname(path.resolve('package.json')),
    defaultBrowser;



function check(niagaraHome, niagaraUserHome) {
  if (!niagaraHome || !niagaraUserHome) {
    console.error([
'*******************************************************************************',
'* Error: niagara_home and niagara_user_home environment variables must be     *',
'* set, or passed in as grunt options --niagara-home and --niagara-user-home). *',
'* If you are not sure of the correct value for niagara_user_home, open        *',
'* Workbench, show the console, and type "echo %niagara_user_home%".           *',
'*******************************************************************************'
    ].join('\n'));
    process.exit(1);
  }
}

/**
 * Default values for command-line options.
 * @module
 * @see grunt-niagara~Options
 */
module.exports = function (grunt) {
  var niagaraHome = grunt.option('niagara-home') || process.env.NIAGARA_HOME,
      niagaraUserHome = grunt.option('niagara-user-home') || process.env.NIAGARA_USER_HOME;

  check(niagaraHome, niagaraUserHome);

  return {
    /** NIAGARA_HOME environment variable */
    'niagara-home': path.normalize(niagaraHome),
    /** NIAGARA_USER_HOME environment variable */
    'niagara-user-home': path.normalize(niagaraUserHome),
    /** directory to run a station from */
    'station-cwd': path.join(niagaraHome, 'bin'),
    /** directory holding your station files */
    'stations-dir': path.join(niagaraUserHome, 'stations'),
    /** {moduleName}UnitTest */
    'station-name': moduleName + 'UnitTest',
    /** localhost */
    'station-host': 'localhost',
     /** 80 */
    'station-http-port': '80',
    /** 443 */
    'station-https-port': '443',
    /** 1911 */
    'station-fox-port': '1911',
    /** 4911 */
    'station-foxs-port': '4911',
    /** false */
    'station-debug': false,
    /** 8000 */
    'station-debug-port': 8000,
    /** false */
    'station-debug-suspend': false,
    /** NONE */
    'station-log-level': 'NONE',
    /** false */
    'override-station-ports': 'false',
    /** 9090 */
    'niagara-test-server-port': '9090',
    /** {moduleDir}/src/jsdoc */
    'jsdoc-dir': path.resolve(projectDir + '/src/jsdoc'),
    /** {niagaraUserHome}/reports/testng/junitreports */
    'junit-reports-dir': path.resolve(niagaraUserHome + '/reports/testng/junitreports'),
    /** {niagaraUserHome}/reports/testng/junitreports */
    'eslint-reports-dir': path.resolve(niagaraUserHome + '/reports/testng/junitreports'),
    /** {niagaraUserHome}/reports/complexity/{moduleName} */
    'complexity-reports-dir': path.resolve(niagaraUserHome + '/reports/complexity/' + name),
    /** false */
    'coverage': 'false',
    /** {niagaraUserHome}/reports/coverage */
    'coverage-reports-dir': path.resolve(niagaraUserHome + '/reports/coverage'),
    /** ChromeHeadless, falling back to PhantomJS */
    'browsers': defaultBrowser || (defaultBrowser = chooseDefaultBrowser(grunt)),
    /** no Chrome flags */
    'chrome-flags': ''
  };
};


function getChromeBin(grunt) {
  let chromeBin = process.env.CHROME_BIN;
  if (chromeBin) {
    grunt.log.debug('Defaulting to Chrome executable path from CHROME_BIN ' +
      'environment variable: ' + chromeBin);
    return chromeBin;
  }

  try {
    chromeBin = require('puppeteer').executablePath();
    grunt.log.debug('Defaulting to Chrome executable path from puppeteer: ' + chromeBin);
    return chromeBin;
  } catch (ignore) {}
}

function chooseDefaultBrowser(grunt) {
  const chromeBin = getChromeBin(grunt);
  if (chromeBin) {
    process.env.CHROME_BIN = chromeBin;
    return 'ChromeHeadless';
  } else {
    grunt.log.debug('No Chrome executable explicitly configured; defaulting to PhantomJS.');
    return 'PhantomJS';
  }
}
