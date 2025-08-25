// Bridge the realms with care—no Node powers cross this boundary
const { contextBridge, ipcRenderer } = require("electron");

function makeAbortError() {
  const err = new Error("Aborted");
  err.name = "AbortError";
  return err;
}

function genId() {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

// Safely expose Oracle access to the frontend
contextBridge.exposeInMainWorld("oracle", {
  ask: (errorText, abortSignal) => {
    const id = genId();

    // If already aborted before we start, cancel immediately
    if (abortSignal && abortSignal.aborted) {
      ipcRenderer.send("oracle:cancel", id);
      throw makeAbortError();
    }

    // Wire cancellation if possible (cross-context friendly)
    let detach = () => {};
    if (abortSignal) {
      const onAbort = () => ipcRenderer.send("oracle:cancel", id);

      if (typeof abortSignal.addEventListener === "function") {
        abortSignal.addEventListener("abort", onAbort, { once: true });
        detach = () => abortSignal.removeEventListener("abort", onAbort);
      } else if ("onabort" in abortSignal) {
        const prev = abortSignal.onabort;
        abortSignal.onabort = () => {
          try { onAbort(); }
          finally { abortSignal.onabort = prev; }
        };
        detach = () => { abortSignal.onabort = prev; };
      } else {
        detach = () => {};
      }
    }

    return ipcRenderer
      .invoke("oracle:invoke", { id, text: errorText })
      .finally(() => detach())
      .catch((err) => {
        // Main normalizes cancels to "ABORTED"
        if (err && (err.message === "ABORTED" || err.name === "AbortError")) {
          throw makeAbortError();
        }
        throw err;
      });
  },
});