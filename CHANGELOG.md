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