/** @module */

'use strict';

var os = require('os');

/**
 * Get network interfaces configured on the host computer and return an array
 * of all external IPv4 addresses.
 *
 * @returns {Array.<String>}
 */
module.exports = function () {
  var interfaces = os.networkInterfaces(),
      addresses = [],
      iname,
      iface,
      addr,
      i;

  for (iname in interfaces) {
    if (interfaces.hasOwnProperty(iname)) {
      iface = interfaces[iname];
      for (i = 0; i < iface.length; i++) {
        addr = iface[i];
        if (addr.family === 'IPv4' && !addr.internal) {
          addresses.push(addr.address);
        }
      }
    }
  }

  return addresses;
};