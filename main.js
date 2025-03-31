const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { askTheOracle } = require('./oracle');

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js')
        }
    });

    win.loadFile('index.html');
}

ipcMain.handle('invoke-oracle', async (event, errorText) => {
    const response = await askTheOracle(errorText);
    return response;
})

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})