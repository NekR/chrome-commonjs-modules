var modules = new Modules({
  resolve: function(path) {
    path = path.replace(/(?:\.js)?$/i, '.js');

    if (!path.indexOf('chrome-extension://')) {
      // do nothing
    } else if (path[0] === '.' || path[0] === '/') {
      path = chrome.runtime.getURL(path);
    } else if (this.relativePath) {
      // relative
      path = chrome.runtime.getURL(this.relativePath + path);
    } else {
      return this.get(path);
    }

    return path;
  }
});