(function() {
  "use strict";

  var global = (new Function('return this'))();
  var Modules = function(params) {
    this.store = new Map();

    this.resolver = params.resolve.bind(this);
    this.require = require.bind(this);
  };

  var Module = function() {};

  Modules.prototype = {
    get: function(id) {
      var module = this.store.get(id);

      if (!module) throw notFound(id);

      return module.exports;
    }
  };

  var notFound = function(id) {
    new Error('Module ' + id + ' not found');
  };

  var loadModule = function(path) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', path, false);
    xhr.send();

    try {
      var response = xhr.response;
    } catch (e) {}

    if (!response) return;

    var module = {
      exports: {},
      id: path,
      __proto__: Module.prototype
    };

    response = '"use strict";\n\n' + response;

    var fn = new Function('module', 'exports', 'require', response);
    fn.call(global, module, module.exports, require);

    return module;
  };

  var getModule = function(path) {
    var modules = this.store;

    if (modules.has(path)) {
      return modules.get(path).exports;
    }

    var module = loadModule(path);

    if (!module) throw notFound(path);

    console.log('[require]:', path);

    // same as firefox sdk does
    Object.freeze(module.exports);
    modules.set(path, module);

    return module.exports;
  };

  var require = function(id) {
    id = this.resolver(id);

    if (!id) {
      throw new Error('Module ID is not present');
    }

    if (id instanceof Module) return id;

    var module = getModule.call(this, id);
  };
}());