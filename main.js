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
const contextMenuMod = require("electron-context-menu");
const contextMenu = contextMenuMod.default || contextMenuMod;

contextMenu({
  showSaveImageAs: false,
  showCopyImage: false,
  shouldShowMenu: (_event, params) => params.isEditable === true,
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

// A scroll of active rites: requestId → AbortController
const activeInvocations = new Map();

// Handle invocations from mortals (frontend) requesting the Oracle’s wisdom
ipcMain.handle("oracle:invoke", async (_event, { id, text }) => {
  const controller = new AbortController();
  activeInvocations.set(id, controller);

  try {
    const response = await askTheOracle(text, controller.signal); // Consult the Oracle
    return response;
  } catch (err) {
    // Axios aborts throw CanceledError / ERR_CANCELED; normalize to a simple token
    const msg = String((err && (err.code || err.name || err.message)) || "");
    if (
      /ERR_CANCELED/i.test(msg) ||
      /CanceledError/i.test(msg) ||
      /aborted|canceled/i.test(msg)
    ) {
      const e = new Error("ABORTED");
      // no stack spam for controlled aborts
      e.name = "AbortError";
      throw e;
    }
    throw err;
  } finally {
    activeInvocations.delete(id);
  }
});

// Heed the mortal's change of heart
ipcMain.on("oracle:cancel", (_event, id) => {
  const ctrl = activeInvocations.get(id);
  if (ctrl) ctrl.abort();
});

// Initialize the temple when the app is ready
app.whenReady().then(() => {
  app.setName("errOracle");
  if (app.dock && icon) app.dock.setIcon(icon); // macOS Dock icon
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