/* eslint-env node */

'use strict';

const { assign } = require('lodash');

function addNonEnumerable(obj, toAdd) {
  Object.keys(toAdd).forEach((prop) => {
    const value = toAdd[prop];
    Object.defineProperty(obj, prop, { enumerable: false, value });
  });
}

function sourceMapping(obj, ext = {}) {
  obj = assign({}, obj, ext);
  addNonEnumerable(obj, {
    from: (cwd) => sourceMapping(obj, { cwd }),
    to: (dest) => sourceMapping(obj, { dest: asDirectory(dest) }),
    forProd: () => obj,
    forKarma: () => sourceMapping(obj, { dest: toKarmaDir(asDirectory(obj.dest)) }),
    forRequireJs: () => sourceMapping(obj, { dest: toESDir(asDirectory(obj.dest)) })
  });
  return obj;
}

function asDirectory(path) {
  if (!path.endsWith('/')) { path += '/'; }
  return path;
}

function allFilesWithSrc(src) {
  return sourceMapping({ expand: true, cwd: '.', src });
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

/**
 * @param {IGrunt} grunt
 * @returns {SourceMappings}
 */
function getSourceMappings(grunt) {
  const {
    source = allJsFiles().from('src/rc').to('build/src/rc'),
    resources = allConfigFiles().from('src/rc').to('build/src/rc'),
    ext = allFiles().from('src/ext').to('build/src/ext'),
    test = allJsFiles().from('srcTest/rc').to('build/srcTest/rc'),
    testResources = allConfigFiles().from('srcTest/rc').to('build/srcTest/rc'),
    testExt = allFiles().from('srcTest/ext').to('build/srcTest/ext')
  } = grunt.config.getRaw('sourceMappings') || {};
  return { source, resources, ext, test, testResources, testExt };
}

const allJsFiles = allFilesWithExtensions.bind(null, [ 'js' ]);
const allConfigFiles = allFilesWithoutExtensions.bind(null, [ 'js' ]);
const allFiles = allFilesWithoutExtensions.bind(null, []);


/**
 * One Grunt-compatible file mapping. The `files` property of most tasks will
 * expect an array of these.
 *
 * @typedef {object} GruntFileMapping
 * @property {string} cwd
 * @property {boolean} expand
 * @property {string[]} src
 * @property {string} dest
 * @property {function} from - specify the cwd (as string)
 * @property {function} to - specify the dest (as string)
 * @property {function} forProd - point this mapping at production
 * @property {function} forKarma - point this mapping at running Karma tests
 * @property {function} forRequireJs - point this mapping as being used during
 * RequireJS optimization
 */

/**
 * Defines where Grunt should find categories of files that will be used in the
 * build and test process.
 *
 * @typedef {object} SourceMappings
 *
 * @property {GruntFileMapping} source - your first-party source, to be
 * transpiled and optimized
 * @property {GruntFileMapping} resources - your first-party non-source files,
 * like CSS or images, to be used unchanged
 * @property {GruntFileMapping} ext - external code and dependencies, to be
 * copied unchanged
 * @property {GruntFileMapping} test - your first-party test code, to be
 * transpiled
 * @property {GruntFileMapping} testResources - your first-party non-source
 * test files, like CSS or images, to be used unchanged
 * @property {GruntFileMapping} testExt - external code and dependencies used in
 * a test context, to be copied unchanged
 */


module.exports = {
  allFilesWithExtensions,
  allFilesWithoutExtensions,
  allConfigFiles,
  allFiles,
  allJsFiles,
  getSourceMappings,
  toESDir,
  toKarmaDir
};
