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
      fail(new Error(error));
    });

    suceed(module);
  });
}

module.exports = function (depNames, moduleFunction) {
  var myMod = currentMod;
  var deps = depNames.map(getModule);

  deps.forEach(function(promises) {
    promises.then(function(mod) {
      if (!mod.loaded)
        mod.onLoad.push(whenDepsLoaded);

        function whenDepsLoaded() {
          if(!mod.loaded)
            return;

          var args = mod.exports;
          var exports = moduleFunction.apply(null, args);

          if (myMod) {
            myMod.exports = exports;
            myMod.loaded = true;
            myMod.onLoad.forEach(function(f) { f(); });
          }
        }
        whenDepsLoaded();

    }, function(error) {
      fail(new Error(error));
    });
  });
};
