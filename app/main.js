const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')


function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, '../app/preload.js')
        }
    })
    Menu.setApplicationMenu(null)
    mainWindow.loadFile(
        path.join(__dirname, '../dist/youtube-to-mp3/index.html')
    )
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})