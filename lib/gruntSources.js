/* eslint-env node */

'use strict';

function allFilesWithSrc(src) {
  let obj = {
    expand: true,
    cwd: '.',
    src
  };

  return {
    from: function (c) { obj.cwd = c; return this; },
    to: function (dest) { obj.dest = dest; return obj; }
  };
}

function allFilesWithExtensions(exts) {
  return allFilesWithSrc(exts.map(ext => `**/*.${ ext }`));
}

function allFilesWithoutExtensions(exts) {
  return allFilesWithSrc([ '**/*.*' ].concat(exts.map(ext => `!**/*.${ ext }`)));
}

const allJsFiles = allFilesWithExtensions.bind(null, [ 'js' ]);
const allConfigFiles = allFilesWithoutExtensions.bind(null, [ 'js' ]);

module.exports = {
  allFilesWithExtensions,
  allFilesWithoutExtensions,
  allConfigFiles,
  allJsFiles
};
