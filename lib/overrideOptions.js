/*eslint-env node */

/** @module */

'use strict';

var cliDefaults = require('./cliDefaults'),
  fs = require('fs');

module.exports = function overrideOptions(grunt) {
  var defaults = cliDefaults(grunt);
  var configFile = grunt.option("config") || defaults["config"];
  if (fs.existsSync(configFile)) {
    var config = JSON.parse(fs.readFileSync(configFile));
    grunt.config.merge(config);
  }
};
