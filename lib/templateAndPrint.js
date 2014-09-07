/** @module */

'use strict';

var Handlebars = require('handlebars'),
    fs = require('fs');

/**
 * Reads the given file, applies the template object with Handlebars, and
 * returns the result.
 *
 * @param {String} fileName
 * @param {Object} [obj] template object
 * @returns {String} template results
 */
module.exports = function templateAndPrint(fileName, obj) {
  var template = Handlebars.compile(fs.readFileSync(fileName, {
        encoding: 'UTF-8'
      }));

  return template(obj || {});
};