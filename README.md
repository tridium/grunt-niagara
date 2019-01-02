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
      'src/rc/**/*.js',
      '!src/rc/**/*.min.js'
    ],
    TEST_FILES = [
      'srcTest/rc/**/*.js'
    ],
    ALL_FILES = SRC_FILES.concat(TEST_FILES);

module.exports = function runGrunt(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jsdoc:     { src: SRC_FILES },
    eslint:    { src: ALL_FILES },
    watch:     { src: ALL_FILES },
    karma:     {},
    babel:     {},
    requirejs: {},
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

### `babel`

As of `grunt-niagara` 2.0, Babel transpilation is provided out of the box. This
will enable you to use ES6 syntax features in your code and have them transpiled
down to ES5 for browser compatibility.

If enabled, by default, all JS files in `src/rc` and `srcTest/rc` will be
transpiled into the `build` directory for packaging into the final JAR. In
conjunction, Karma will look in `build/karma` to run tests against the
transpiled files.

The transpilation can be configured using the `source` and `test` properties as
described below.

```
// I might only want to transpile the files in the es6 directory rather than the
// entirety of my src directory.
babel: {
  source: {
    'es6/rc': 'build/src/rc'
  },
  test: {
    'es6/spec': 'build/srcTest/rc/spec'
  }
}
```

**Minimal config:**

No configuration necessary. An empty object will enable the default
transpilation behavior.

### `copy`

You may want certain files to be copied directly into the JAR without any sort
of linting or testing, such as third-party libraries you did not create. The
default behavior is to simply copy over any non-JS files in `src/rc` and
`srcTest/rc`, and any files at all in `src/ext` and `srcTest/ext`. Remember to
include these `ext` directories in your Gradle file if needed.

**Minimal config:**

No configuration necessary - will always be available.

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

As of `grunt-niagara` 2.0, the `watch` task will be configured to run linting
and transpilation only on those files which were actually changed, which will
help speed up development. To disable this behavior so *all* files are linted
and transpiled on every change, set the `onDemand` option to `false`:

```
watch: {
  options: { onDemand: false },
  src: SRC_FILES
}
```

**Minimal config:**

`src`: array of file definitions that will trigger a test run when saved.
