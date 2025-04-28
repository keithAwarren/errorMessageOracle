// Electron security modules
const { contextBridge, ipcRenderer } = require("electron");

// Safely expose Oracle access to the frontend
contextBridge.exposeInMainWorld("oracle", {
  // Ask the Oracle by sending errorText to the main process
  ask: (errorText) => ipcRenderer.invoke("invoke-oracle", errorText),
});