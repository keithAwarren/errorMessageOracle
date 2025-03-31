const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("oracle", {
  ask: (errorText) => ipcRenderer.invoke("invoke-oracle", errorText),
});