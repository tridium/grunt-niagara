module.exports = {
  "moduleResources": {
    "Handlebars": [
      "nmodule/js/rc/handlebars/handlebars-v4.0.6",
      "nmodule/js/rc/handlebars/handlebars-v2.0.0" //4.2 and previous
    ],
    "hbs": "nmodule/js/rc/require-handlebars-plugin/hbs",
    "underscore": "nmodule/js/rc/underscore/underscore"
  },
  "paths": {
    "bajaScript": "empty:",
    "bajaux": "empty:",
    "dialogs": "empty:",
    "jquery": "empty:",
    "nmodule": "empty:",
    "Promise": "empty:"
  },
  "exclude": [ "Handlebars", "underscore", "hbs" ],
  "rawText": {
    "baja": "define({load:function(n,p,o,c){console.log(\"omitting baja!\" + n);o();}});",
    "css": "define({load:function(n,p,o,c){console.log(\"omitting css!\" + n);o();}});",
    "lex": "define({load:function(n,p,o,c){console.log(\"omitting lex!\" + n);o();}});"
  },
  "excludeShallow": [ "baja", "lex", "hbs" ]
};