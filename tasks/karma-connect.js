/* eslint-env node */

/** @module */

'use strict';

var path = require('path'),
  templateAndPrint = require('../lib/templateAndPrint'),
  getIpAddresses = require('../lib/getIpAddresses');

/**
 * The `karma-connect` task prints out info on connecting devices to the
 * Karma runner. No need to call it directly; it will automatically run during
 * the `watch` task to provide information on connecting mobile devices etc.
 *
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {
  grunt.registerTask('karma-connect',
    'Prints out info on connecting devices to the Karma runner.', function () {

    var fileName = path.resolve(__dirname, '../info/karma-connect.hbs'),
        addresses = getIpAddresses();

    grunt.log.write(templateAndPrint(fileName, {
      ipAddress: addresses[0] || 'yourIpAddress',
      karmaPort: grunt.config('karma.options.port') || 9876
    }));
  });
};
