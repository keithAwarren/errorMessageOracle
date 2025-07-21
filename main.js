// Enable live reload during development for faster iteration
if (process.env.NODE_ENV === "development") {
  require("electron-reload")(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`),
  });
}

// Core Electron modules and Oracle interface
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { askTheOracle } = require("./oracle");

// Create the main application window
function createWindow() {
  const win = new BrowserWindow({
    width: 650,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Safely bridge frontend and backend
      contextIsolation: true, // Protect against untrusted scripts
      nodeIntegration: false, // Disable Node integration for frontend security
    },
  });

  win.loadFile("index.html"); // Load the Oracle's visual chamber
}

// Handle invocations from mortals (frontend) requesting the Oracle’s wisdom
ipcMain.handle("invoke-oracle", async (event, errorText) => {
  console.log("[Main] Oracle was summoned with:", errorText);
  const response = await askTheOracle(errorText); // Consult the Oracle and return the prophecy
  console.log("[Main] Oracle responds:", response);
  return response;
});

// Initialize the temple when the app is ready
app.whenReady().then(() => {
  createWindow();

  // On macOS, recreate a window when the dock icon is clicked and no windows are open
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Exit the temple when all windows are closed (except on macOS, where it lingers)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});