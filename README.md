# grunt-niagara

> Common Grunt tasks for Niagara modules

## Getting Started
This plugin requires Grunt `~1.0.1`

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

If you are creating a brand new Niagara web module, consider using
[grunt-init-niagara](https://github.com/tridium/grunt-init-niagara) to get
up and running quickly.

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
    eslint:    { src: SRC_FILES },
    watch:     { src: SRC_FILES },
    karma:     {},
    niagara:   {
      station: {
        forceCopy: true,
        sourceStationFolder: './srcTest/stations/bajauxUnitTest'
      }
    },
    requirejs: {}
  });

  grunt.loadNpmTasks('grunt-niagara');
};
```

## Notes about default behavior

### `jsdoc`
 
Generates JSDocs and places them in `jsdoc-dir`.

**Minimal config:**

`src`: array of file definitions to process for JSDoc

### `eslint`

Performs ESLint analysis and fails the build if any errors are found. Error
report will be placed in `eslint-reports-dir`.

Tip: If running ESLint direct from the command line, type `eslint:src` to get
output formatted for display. Type `eslint:fix` to automatically fix all
fixable errors.

**Minimal config:**

`src`: array of file definitions to analyze with ESLint.

### `karma`

Runs browser-based unit tests. Its default starting point will be to execute JS
found at `srcTest/rc/browserMain.js`. Test reports will be placed in
`junit-reports-dir`, and code coverage reports (if running `grunt ci`) will be
placed in `coverage-reports-dir`.

If `niagara.station` config is present, it will start a station prior to running
tests.

**Minimal config:**

No configuration necessary. An empty object will enable Karma tests.

### `niagara.station`

Configures a station to start up for Karma tests. See the `niagara-station` npm
module.

### `pkg`

Reads the contents of `package.json`. This is required for `grunt-niagara` to
function.

### `requirejs`

Performs r.js optimization. By default, it will include every .js file under
`src/rc` and place the optimized file at
`build/src/rc/{moduleName}.built.min.js`.

It will map `nmodule/yourModuleName` to the `src` directory. This conforms to
the Niagara RequireJS module ID convention, where `nmodule` maps to a URL
starting with `/module`. Therefore a file at `src/rc/foo.js` should map to
the RequireJS ID `nmodule/yourModuleName/rc/foo`.

RequireJS plugins `baja!`, `css!`, `log!`, and `lex!` will be disabled during
the build, as they only make sense in the context of a running station. To
configure this list, set your `disablePlugins` option to an array of plugin
names (omitting the '!'). Other common Niagara modules like `bajaux` and
`Promise` will be excluded using the `empty:` syntax. Handlebars templates will
be compiled using the copy of Handlebars from the `js` module jar.

One build task named `src` will be present, so you can override default behavior
like this:

```
require: {
  src: {
    options: {
      include: [ 'nmodule/myModule/rc/OnlyThisOneModule' ],
      out: 'build/src/rc/differentTargetFile.built.min.js'
    }
  },
  anotherBuild: {
    options: { /* ... */ }
  }
}
```

Or, if you wish to "cancel out" the `src` build and configure all your builds
by hand, just set it to a falsy value:

```
require: {
  src: false,
  myOwnBuild: {
    options: { /* ... */ }
  }
}
```

**Minimal config:**

No configuration necessary. An empty object will allow r.js optimization as
described.

### `watch`

Starts up in watch mode, performing ESLint analysis and running Karma tests
every time you save a file.

If you want to customize which Grunt tasks are run when you save a file, pass
a function as a `tasks` parameter like this:

```
watch: {
  src: SRC_FILES,
  tasks: function (defaultTasks) {
    // the default tasks run ESLint followed by Karma.
    return [ 'run-first' ].concat(defaultTasks).concat([ 'run-after' ]);
  }
}
```

**Minimal config:**

`src`: array of file definitions that will trigger a test run when saved.
