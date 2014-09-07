# grunt-niagara

> Common Grunt tasks for Niagara modules

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it
explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as
well as install and use Grunt plugins.

```shell
npm install grunt-niagara --save-dev
```

```js
grunt.loadNpmTasks('grunt-niagara');
```

## Using grunt-niagara

`grunt-niagara` provides no custom tasks of its own. Instead, it loads other
tasks and smart default configurations for those tasks into your project. To
see these tasks, after following the steps above, type `grunt usage`.

## A bare minimum config

Most of the tasks provided require Grunt configurations of their own.
`grunt-niagara` will provide default configurations that reflect Niagara
recommended practices, so the required configuration is kept to a minimum and
you can get on with developing!

Almost all the tasks only require a `src` property with the files needed.
These can easily be shared among the different tasks.

If you don't wish to use a certain task, just leave its configuration object
out of the grunt config and grunt-niagara will disable it.

Additional options provided will override the defaults, so your own
configuration can be as specific as you need. This is just a minimum to get
started.

```js
var SRC_FILES = [
      'Gruntfile.js',
      'src/rc/**/*.js',
      '!src/rc/**/*.build.js',
      '!src/rc/**/*.built.js',
      '!src/rc/**/*.min.js'
    ];

module.exports = function runGrunt(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jsdoc:     { src: SRC_FILES },
    jshint:    { src: SRC_FILES },
    plato:     { src: SRC_FILES },
    watch:     { src: SRC_FILES },
    karma:     {},
    niagara:   {
      station: {
        forceCopy: true,
        sourceStationFolder: './srcTest/stations/bajauxUnitTest'
      }
    }
  });

  grunt.loadNpmTasks('grunt-niagara');
};
```
