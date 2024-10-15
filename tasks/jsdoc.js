/* eslint-env node */

/** @module */

'use strict';

var templateAndPrint = require('../lib/templateAndPrint'),
    loadTasksRelative = require('../lib/loadTasksRelative'),
    jsdocConfig = require('../conf/jsdocConfig'),
    path = require('path'),
    Tempfile = require('temporary/lib/file'),

    UNLINK_TASK_NAME = '__cleanupTempFiles';

/**
 * The `jsdoc` task generates JSDoc documentation using Docdash.
 *
 * @param {IGrunt} grunt
 */
module.exports = function (grunt) {
  if (!grunt.config('jsdoc')) {
    return;
  }

  loadTasksRelative(grunt, 'grunt-jsdoc');

  grunt.renameTask('jsdoc', '_jsdoc');

  grunt.registerMultiTask('jsdoc', 'Performs JSDoc build', function () {
    var pkg = grunt.file.readJSON('package.json'),
        docFile = new Tempfile(),
        docConf = path.resolve(__dirname, '../conf/jsdoc.conf.hbs');

    docFile.writeFileSync(templateAndPrint(docConf, {
      name: pkg.name,
      moduleName: pkg.name.replace(/-(ux|rt|wb|se|doc)$/, ''),
      copyrightYear: new Date().getFullYear(),
      layoutFile: path.resolve(__dirname, '../conf/layout.tmpl').replace(/\\/g, "/")
    }));

    grunt.registerTask(UNLINK_TASK_NAME, function () {
      docFile.unlinkSync();

      //TODO: uncomment after unregisterTasks makes it into master
      // grunt.unregisterTasks([ UNLINK_TASK_NAME ]);
    });

    grunt.config('_jsdoc', jsdocConfig(grunt));
    grunt.config('_jsdoc.options.configure', docFile.path);
    grunt.task.run('_jsdoc', UNLINK_TASK_NAME);
  });
};
