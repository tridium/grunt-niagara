/* eslint-env node */

/** @module */

'use strict';

var extend = require('../lib/deepExtend'),
    loadTasksRelative = require('../lib/loadTasksRelative'),
    moduledev = require('niagara-moduledev'),
    defaultOptions = require('./defaults/requirejsDefaults'),
    pify = require('pify');

function toNmoduleRequireJsId(filePath, moduleName) {
  return `nmodule/${ moduleName }/${ filePath.replace(/\.js$/, '') }`;
}

let mdPromise;
function getModuledev() {
  return mdPromise || (mdPromise = pify(moduledev).fromFile());
}

function toPaths(moduleResources) {
  return getModuledev().then((md) => pify(md).getRequireJsPaths(moduleResources));
}

function applyDisablePlugins(options) {
  (options.disablePlugins || []).forEach((plugin) => {
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
      addPath;
  
  if (typeof config.src === 'undefined') {
    config.src = {};
  }

  if (transpilingEnabled) {
    // if we're transpiling, disable r.js minification (which does not support
    // es6) - we'll minify the builtfile ourselves
    grunt.config('requirejs.options.optimize', 'none');
    loadTasksRelative(grunt, 'grunt-contrib-uglify');
    addPath = {
      paths: {
        ['nmodule/' + moduleName]: 'build/es/src',
        ['nmodule/' + moduleName + 'Test']: 'build/es/srcTest'
      }
    };
  } else {
    addPath = {
      paths: {
        ['nmodule/' + moduleName]: 'src',
        ['nmodule/' + moduleName + 'Test']: 'srcTest'
      }
    };
  }
  
  return Promise.all(Object.keys(config).map((buildName) => {
    if (buildName === 'options') {
      return; //not really a build
    }
    
    let build = config[buildName];
    if (build) {
      const options = extend({}, addPath, defaultOptions, masterOptions, build.options);

      if (buildName === 'src') {
        const toRequireJsId = options.toRequireJsId || toNmoduleRequireJsId;

        options.include = options.include ||
          grunt.file.expand({ cwd: 'src' }, [ '**/*.js', '!**/*.built.min.js' ])
            .map((filePath) => toRequireJsId(filePath, moduleName));
      }

      const out = options.out || 'build/src/rc/' + moduleName + '.built.min.js';
      options.out = out;

      // if we're transpiling, transpile the builtfile and then minify.
      // this avoids having all the babel helper functions get duplicated
      // many times inside the builtfile.
      if (transpilingEnabled) {
        grunt.config('babel.builtfile_' + buildName, {
          files: [ { src: out, dest: out } ]
        });
        grunt.config('uglify.builtfile_' + buildName, {
          files: [ { src: out, dest: out } ],
          options: {
            banner: options.banner || ''
          }
        });
      }

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
