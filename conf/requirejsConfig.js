/* eslint-env node */

/** @module */

'use strict';

var extend = require('../lib/deepExtend'),
    moduledev = require('niagara-moduledev'),
    defaultOptions = require('./defaults/requirejsDefaults'),
    pify = require('pify');

function toRequireJsId(filePath) {
  return 'nmodule/<%= pkg.name %>/' + filePath.replace(/\.js$/, '');
}

let mdPromise;
function getModuledev() {
  return mdPromise || (mdPromise = pify(moduledev).fromFile());
}

function toPaths(moduleResources) {
  return getModuledev().then(md => pify(md).getRequireJsPaths(moduleResources));
}

function applyDisablePlugins(options) {
  (options.disablePlugins || []).forEach(plugin => {
    let rawText = options.rawText || (options.rawText = {}),
        excludeShallow = options.excludeShallow || (options.excludeShallow = []);
    
    //add in a fake stub for this plugin to prevent r.js from even trying to execute it
    rawText[plugin] = 'define({' +
      'load:function(n,p,o,c){console.log("omitting ' + plugin + '!" + n);o();}' +
      '});';
    
    //make sure the fake stub is not included in the build
    if (excludeShallow.indexOf(plugin) < 0) {
      excludeShallow.push(plugin);
    }
  });
  delete options.disablePlugins;
}

/**
 * Sets up defaults for
 * [grunt-contrib-requirejs](https://github.com/gruntjs/grunt-contrib-requirejs).
 *
 * @param {IGrunt} grunt
 * @returns {Promise.<Object>} configuration for `requirejs` task
 */
module.exports = function (grunt) {
  let config = grunt.config.getRaw('requirejs') || {},
      masterOptions = config.options,
      moduleName = grunt.config.get('pkg.name').replace(/-(ux|rt|wb|se|doc)$/, ''),
      transpilingEnabled = !!grunt.config('babel'),
      rootDir = transpilingEnabled ? 'build/src' : 'src',
      addPath = {
        paths: {
          ['nmodule/' + moduleName]: rootDir,
          ['nmodule/' + moduleName + 'Test']: rootDir + 'srcTest'
        }
      };
  
  if (typeof config.src === 'undefined') {
    config.src = {};
  }
  
  return Promise.all(Object.keys(config).map(buildName => {
    if (buildName === 'options') {
      return; //not really a build
    }
    
    let build = config[buildName];
    if (build) {
      let options = {};
      if (buildName === 'src') {
        options.include = grunt.file.expand({ cwd: rootDir }, [ '**/*.js', '!**/*.built.min.js' ])
          .map(toRequireJsId);
        options.out = 'build/src/rc/' + moduleName + '.built.min.js';
      }
      options = extend(true, options, addPath, defaultOptions, masterOptions, build.options);
      applyDisablePlugins(options);
      
      return toPaths(options.moduleResources)
        .then(function (paths) {
          options.paths = extend(options.paths, paths);
          grunt.log.debug(buildName + ' options:');
          grunt.log.debug(JSON.stringify(options, null, 2));
          build.options = options;
        });
    } else {
      delete config[buildName];
    }
  }))
    .then(() => config);
};
