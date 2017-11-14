var fs = require('fs');

function backgroundReadFile(file) {
  return new Promise(function(suceed, fail) {
    suceed(fs.readFile(file));
  });
}

var defineCache = Object.create(null);
var currentMod = null;

function getModule(name) {
  return new Promise(function(suceed, fail) {
    if (name in defineCache)
      suceed(defineCache[name]);

    var module = {
      exports: null,
  		loaded: false,
  		onLoad: []
    };

    defineCache[name] = module;
    backgroundReadFile(name + ".js").then(function(code) {
      currentMod = module;
      new Function("", code)();
    }, function(error) {
      fail(new Error(err));
    });

    suceed(module);
  });
}
