const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')
const { handleYoutubeDownloadAudio } = require('./downloader')

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

async function handleFolderOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    const folder = canceled ? null : filePaths[0]
    // TODO: Guardar carpeta seleccionada
    return folder
}

app.whenReady().then(() => {
    ipcMain.handle('yt:downloadAudio', handleYoutubeDownloadAudio)
    ipcMain.handle('dialog:openFolder', handleFolderOpen)
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})