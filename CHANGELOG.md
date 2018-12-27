<a name="1.0.0"></a>
## 1.0.0 (2018/12/27)

* Release 1.0.0.

<a name="0.1.41"></a>
## 0.1.41 (2018/6/11)

* Temporarily revert karma to 1.3.0 to resolve "no message in 10000ms" errors
  when testing in Chrome.

<a name="0.1.40"></a>
## 0.1.40 (2018/5/30)

* Add `--chrome-flags` command line flag.

<a name="0.1.39"></a>
## 0.1.39 (2018/5/23)

Default browser to ChromeHeadless when either:

* `puppeteer` is installed (can be installed globally when `NODE_PATH` is set
   to include the global `node_modules` directory), or
* `CHROME_BIN` environment variable is set.

Otherwise PhantomJS will remain the default. ChromeHeadless can be used anyway
with the command line flag `--browsers=ChromeHeadless`.

<a name="0.1.38"></a>
## 0.1.38 (2018/3/9)

* Add log! to excluded RequireJS plugins (affects Niagara 4.6+).

<a name="0.1.37"></a>
## 0.1.37 (2018/2/2)

* Fix problem with reporting JSHint failures in CI reports.

<a name="0.1.36"></a>
## 0.1.36 (2017/12/19)

* Restore default RequireJS builtfile to moduleName, not pkgName.

<a name="0.1.35"></a>
## 0.1.35 (2017/12/18)

* Allow module name in package.json to include the runtime profile. This allows
two different runtime profiles of the same module (e.g. `myModule-ux` and
`myModule-wb`) to have their own suites of tests and not have their generated
reports overwrite each other.

<a name="0.1.34"></a>
## 0.1.34 (2017/11/20)

* Fix JSDoc generation.

<a name="0.1.33"></a>
## 0.1.33 (2017/05/22)

* Bugfix.

<a name="0.1.32"></a>
## 0.1.32 (2017/05/22)

* Provide `build/src` and `build/srcTest` as source folders for Karma. This
  allows intermediary build artifacts to be included in unit tests.

<a name="0.1.31"></a>
## 0.1.31 (2017/05/18)

* Remove unnecessary phantomjs-prebuilt dependency as this is covered by
  karma-phantomjs-launcher. This allows global installation of
  phantomjs-prebuilt to save disk space, if desired.

<a name="0.1.30"></a>
## 0.1.30 (2017/05/12)

* Bugfix.

<a name="0.1.29"></a>
## 0.1.29 (2017/05/11)

* Merge master requirejs options into individual task options (prevent child
`paths` config from being overwritten).
* Support `disablePlugins` for `baja!`, `lex!`, etc.
* Default `findNestedDependencies` to true to match existing `niagara-rjs`
behavior.

<a name="0.1.28"></a>
## 0.1.28 (2017/05/06)

Add niagara-moduledev and grunt-contrib-requirejs as dependencies, enabling
Grunt-based optimization as an alternative to the Gradle plugin.

<a name="0.1.27"></a>
## 0.1.27 (2017/04/11)

* Add IE browser launcher

<a name="0.1.26"></a>
## 0.1.26 (2016/08/31)

* Allow disabling coverage preprocessing by calling
`grunt.option('coverage-preprocessors', false)`. Useful for using other modules
that perform their own Karma preprocessing.
* Allow any file under `src` or `srcTest` to be included by Karma, not just
those under `rc` subfolders.
* Restore `karma-html-reporter`.
* Bump dependencies.


<a name="0.1.25"></a>
## 0.1.25 (2016/07/19)

* Allow watch tasks to append or define as a function. This allows you to easily
inject additional tasks like transpiling when running `grunt watch`.


<a name="0.1.24"></a>
## 0.1.24 (2016/06/17)

* Update PhantomJS to v2. The addition of websockets support may cause
sporadic failure of BajaScript specs. This will be fixed in Niagara 4.3. In the
meantime, if it affects your tests, configure your tests' `config.bog` to
disable the `BoxService` websocket acceptor, and BajaScript will revert to the
polling method.

<a name="0.1.23"></a>
## 0.1.23 (2016/05/25)

* Update dependencies to fix npm3 incompatibilities
* Disable karma-html-reporter for Node v6.2.0+ (issue 25)
* Temporarily omitting PhantomJS v2 upgrade due to incompatibility with
  BajaScript + websockets

<a name="0.1.22"></a>
## 0.1.22 (2016/03/23)

* More informative environment variable messages
* Add transitive dependencies for npm3 support

<a name="0.1.21"></a>
## 0.1.21 (2015/10/29)

* Add `ddescribe` and `iit` to default JSHint globals
* Add station debug/suspend (`station-debug` and `station-debug-suspend` flags)
* Display station output during `grunt watch`

<a name="0.1.20"></a>
## 0.1.20 (2015/04/09)

* Add support for station digest auth
* Don't treat `Promise` as a global (require explicit import)

<a name="0.1.19"></a>
## 0.1.19 (2014/09/07)

* Initial publication
