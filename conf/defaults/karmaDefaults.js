'use strict';

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

  /** look for `srcTest/rc/browserMain.js` as an entry point, with everything
   *  in `src/rc` and `srcTest/rc` provided */
  files: [

    'srcTest/rc/browserMain.js',

    // all src and test modules (included: false)
    { pattern: 'src/rc/**/*', included: false },
    { pattern: 'srcTest/rc/**/*', included: false }
  ],

  /** don't include any min/built files */
  exclude: [
    '**/*.min.js',
    '**/*.built.js'
  ],

  /** use PhantomJS */
  browsers: [
    'PhantomJS'
  ],

  /** use onscreen reporter and JUnit export */
  reporters: [ 'progress', 'junit' ],

  /** host Karma from `/__karma/` */
  urlRoot: '/__karma/',

  /** do single run */
  singleRun: true,
  
  /** grunt-niagara will configure to do its own run **/
  autoWatch: false
};
