/* eslint-env node */

'use strict';

const fs = require('fs');

function isPopulatedDirectory(dir) {
  return fs.existsSync(dir) &&
    fs.statSync(dir).isDirectory() &&
    fs.readdirSync(dir).length;
}

const populatedSrcDirs = [ 'src', 'srcTest', 'build/src', 'build/srcTest' ]
        .filter(isPopulatedDirectory);

/**
 * A set of smart defaults for Karma configuration.
 *
 * @module
 */
module.exports = {

  /** run Karma server on localhost */
  hostname: 'localhost',

  /** run Karma server on port 9876 */
  port: 9876,

  /** use Jasmine with RequireJS */
  frameworks: [ 'jasmine', 'requirejs' ],

  /**
   * look for `srcTest/rc/browserMain.js` as an entry point, then provide
   * all contents of populated src directories
   */
  files: [ 'srcTest/rc/browserMain.js' ]
    .concat(populatedSrcDirs.map(dir => ({
      pattern: dir + '/**/*', included: false
    }))),

  /** use PhantomJS */
  browsers: [
    'ChromeHeadless'
  ],

  /** use onscreen reporter and JUnit export */
  reporters: [ 'progress', 'junit' ],

  /** host Karma from `/__karma/` */
  urlRoot: '/__karma/',

  /** do single run */
  singleRun: true,
  
  /** grunt-niagara will configure to do its own run **/
  autoWatch: false,

  /** allow some extra time if browser gets CPU starved */
  browserNoActivityTimeout: 60000
};
