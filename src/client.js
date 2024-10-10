// console.log("client.js");

/** @type {Map<string, HotModule>} */
window.hotModules ??= new Map();

class HotModule {
  constructor(file) {
    this.file = file;
  }

  accept(cb) {
    this.cb = cb;
  }

  handleAccept() {
    if (!this.cb) return;
    import(`${this.file}?t=${Date.now()}`).then(this.cb);
  }
}

function hmrClient(mod) {
  const url = new URL(mod.url);
  const hot = new HotModule(url.pathname);
  mod.hot = hot;
  // import.meta.hot = hot;
  // hot.handleAccept();
  window.hotModules.set(url.pathname, hot);
}

if (!window.ws) {
  window.ws = new WebSocket(`ws://${location.host}/ws`);
  window.ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "file:changed") {
      const hot = window.hotModules.get(data.file);
      if (hot) {
        hot.handleAccept();
      }
    }
  });
}
