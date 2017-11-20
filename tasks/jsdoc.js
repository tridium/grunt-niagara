/** @module */

'use strict';

var templateAndPrint = require('../lib/templateAndPrint'),
    loadTasksRelative = require('../lib/loadTasksRelative'),
    jsdocConfig = require('../conf/jsdocConfig'),
    path = require('path'),
    Tempfile = require('temporary/lib/file'),

    UNLINK_TASK_NAME = '__cleanupTempFiles';

/**
 * The `jsdoc` task generates JSDoc documentation using Docstrap.
 *
 * @param {Grunt} grunt
 */
module.exports = function (grunt) {
  if (!grunt.config('jsdoc')) {
    return;
  }

  loadTasksRelative(grunt, 'grunt-jsdoc');

  grunt.renameTask('jsdoc', '_jsdoc');

  grunt.registerMultiTask('jsdoc', 'Performs JSDoc build', function () {
    var pkg = grunt.file.readJSON('package.json'),
        docstrapFile = new Tempfile(),
        docstrapConf = path.resolve(__dirname, '../conf/jsdoc.conf.hbs');

    docstrapFile.writeFileSync(templateAndPrint(docstrapConf, {
      name: pkg.name,
      copyrightYear: new Date().getFullYear()
    }));

    grunt.registerTask(UNLINK_TASK_NAME, function () {
      docstrapFile.unlinkSync();

      //TODO: uncomment after unregisterTasks makes it into master
      // grunt.unregisterTasks([ UNLINK_TASK_NAME ]);
    });

    grunt.config('_jsdoc', jsdocConfig(grunt));
    grunt.config('_jsdoc.options.configure', docstrapFile.path);
    grunt.task.run('_jsdoc', UNLINK_TASK_NAME);
  });
};