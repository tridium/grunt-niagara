/* eslint-env node */

'use strict';

module.exports = {
  "moduleResources": {
    "Handlebars": [
      "nmodule/js/rc/handlebars/handlebars",
      "nmodule/js/rc/handlebars/handlebars-v4.0.6", //4.8 and previous
      "nmodule/js/rc/handlebars/handlebars-v2.0.0" //4.2 and previous
    ],
    "hbs": "nmodule/js/rc/require-handlebars-plugin/hbs",
    "underscore": "nmodule/js/rc/underscore/underscore"
  },
  "disablePlugins": [ "baja", "css", "lex", "log" ],
  "findNestedDependencies": true,
  "paths": {
    "bajaScript": "empty:",
    "bajaux": "empty:",
    "d3": "empty:",
    "dialogs": "empty:",
    "jquery": "empty:",
    "moment": "empty:",
    "niagaraSystemProperties": "empty:",
    "nmodule": "empty:",
    "Promise": "empty:"
  },
  "exclude": [ "Handlebars", "underscore", "hbs" ],
  "excludeShallow": [ "baja", "lex", "log", "Handlebars", "underscore", "hbs" ]
};
