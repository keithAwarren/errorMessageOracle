// Enable live reload during development for faster iteration
if (process.env.NODE_ENV === "development") {
  require("electron-reload")(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`),
  });
}

// Summon the sacred modules of Electron and the Oracle's wisdom channel
const { app, BrowserWindow, ipcMain, nativeImage } = require("electron");
const path = require("path");
const { askTheOracle } = require("./oracle");
const contextMenuMod = require('electron-context-menu');
const contextMenu = contextMenuMod.default || contextMenuMod;

contextMenu({
  showSaveImageAs: false,
  showCopyImage: false,
  shouldShowMenu: (_event, params) => params.isEditable === true
});

const iconPath = path.join(__dirname, "assets/crystalBallPixel.png");
const icon = nativeImage.createFromPath(iconPath);

// Conjure the main window
function createWindow() {
  const win = new BrowserWindow({
    width: 650,
    height: 750,
    icon,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Safely bridge frontend and backend realms
      contextIsolation: true, // Seal the chamber against intrusive spirits
      nodeIntegration: false, // Deny Node's power to the frontend realm
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
  app.setName("errOracle");
  app.dock.setIcon(icon); // Set Dock icon once
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

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});