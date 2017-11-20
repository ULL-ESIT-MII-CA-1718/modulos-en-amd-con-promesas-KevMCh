const {promisify} = require('util');

var fs = require('fs');
var backgroundReadFile = promisify(fs.readFile);

var defineCache = Object.create(null);
var currentMod = {
  exports: null,
  loaded: false,
  onLoad: []
};

function getModule(name) {
  return new Promise((success, fail) => {
    if (name in defineCache)
      success(defineCache[name]);

    var module = {
      exports: null,
      loaded: false,
      onLoad: []
    };

    backgroundReadFile(name + ".js").then((code) => {

      currentMod = module;
      new Function("", code)();

      defineCache[name] = module;
      success(module);

    }, (error) => {
      fail(new Error(error));
    });
  });
}

module.exports = function (depNames, moduleFunction) {
  var myMod = currentMod;
  var deps = depNames.map(getModule);

  Promise.all(deps).then((modules) => {

    modules.forEach(function(mod) {
      if (!mod.loaded) {
        mod.onLoad.push(whenDepsLoaded);
      }
    });

    function whenDepsLoaded() {
      if (!modules.every(function(m) { return m.loaded; }))
        return;

      var args = modules.map(function(m) {
        return m.exports;
      });

      var exports = moduleFunction.apply(null, args);
      if (myMod) {
        myMod.exports = exports;
        myMod.loaded = true;
        myMod.onLoad.forEach(function(f) { f(); });
      }
    }

    whenDepsLoaded();
  }).catch((error) => console.log("Error: " + error));
};
