/* eslint-env node */

/** @module */

'use strict';

const extend = require('../lib/deepExtend');
const babelConfig = require('./babelConfig');
const eslintConfig = require('./eslintConfig');

let changedFiles = {};

/**
 * Sets up defaults for
 * [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch).
 *
 * Watch behavior will be to run transpilation, linting and tests upon every
 * file change.
 *
 * @param {IGrunt} grunt
 * @returns {Object} configuration for `watch` task
 */
module.exports = function (grunt) {
  var oldConfig = grunt.config.getRaw('watch') || {},
    onDemand = (oldConfig.options && oldConfig.options.onDemand) !== false,
    newConfig = {
      options: { spawn: false },
      files: oldConfig.src,
      tasks: [ 'runWatchTasks' ]
    };

  grunt.registerTask('runWatchTasks', function () {
    if (onDemand) {
      updateFromChangedSources(grunt,
        Object.keys(changedFiles).filter((src) => src.endsWith('.js')));
      changedFiles = {};
    }
    grunt.task.run(getTasksToRun(grunt, oldConfig.tasks));
  });

  // set up grunt to lint/transpile only changed files.
  if (onDemand) {
    grunt.event.on('watch', (action, filepath) => {
      changedFiles[filepath.replace(/\\/g, '/')] = action;
    });
  }

  delete oldConfig.src;
  return extend(true, oldConfig, newConfig);
};

function getTasksToRun(grunt, configuredTasks) {
  const defaultTasks = getDefaultTasks(grunt);

  if (configuredTasks) {
    if (Array.isArray(configuredTasks)) {
      return configuredTasks.concat(defaultTasks);
    } else if (typeof configuredTasks === 'function') {
      return configuredTasks(defaultTasks);
    } else {
      throw new Error('grunt.config.watch.tasks must be either an Array or a function.');
    }
  } else {
    return defaultTasks;
  }
}

function getDefaultTasks(grunt) {
  let tasks = [];

  if (hasBabel(grunt)) {
    tasks = [ 'babel:watch', 'copy' ].concat(tasks);
  }

  if (hasKarma(grunt)) {
    tasks.push('karma:watch:run');
  }

  if (hasEslint(grunt)) {
    tasks.push('eslint:src');
  }

  return tasks;
}

function updateFromChangedSources(grunt, changedSources) {
  if (hasEslint(grunt)) {
    eslintConfig.updateFromWatch(grunt, changedSources);
  }

  if (hasBabel(grunt)) {
    babelConfig.updateFromWatch(grunt, changedSources);
  }
}

function hasBabel(grunt) { return !!grunt.config.getRaw('babel'); }

function hasEslint(grunt) { return !!grunt.config.getRaw('eslint'); }

function hasKarma(grunt) { return !!grunt.config.getRaw('karma'); }
