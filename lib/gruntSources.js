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
    to: function (dest) { obj.dest = dest; return obj; },
    toKarma: function (dest) { obj.dest = toKarmaDir(dest); return obj; },
    toES: function (dest) { obj.dest = toESDir(dest); return obj; }
  };
}

function allFilesWithExtensions(exts) {
  return allFilesWithSrc(exts.map((ext) => `**/*.${ ext }`));
}

function allFilesWithoutExtensions(exts) {
  return allFilesWithSrc([ '**/*.*' ].concat(exts.map((ext) => `!**/*.${ ext }`)));
}

function toKarmaDir(dir) {
  return dir.replace(/^build\//, 'build/karma/');
}

function toESDir(dir) {
  return dir.replace(/^build\//, 'build/es/');
}

const allJsFiles = allFilesWithExtensions.bind(null, [ 'js' ]);
const allConfigFiles = allFilesWithoutExtensions.bind(null, [ 'js' ]);
const allFiles = allFilesWithoutExtensions.bind(null, []);

module.exports = {
  allFilesWithExtensions,
  allFilesWithoutExtensions,
  allConfigFiles,
  allFiles,
  allJsFiles,
  toKarmaDir
};
