const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')
const { handleYoutubeDownloadAudio } = require('./downloader')
const Store = require("electron-store")
const store = new Store();

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, '../app/preload.js')
        },
        icon: path.join(__dirname, 'assets/images/icon.png')
    })
    const menu = Menu.buildFromTemplate([
        {
            label: "Archivo",
            submenu: [
                {
                    click: () => mainWindow.webContents.send('loadview', 'home'),
                    label: 'Descargar audio',
                },
                {
                    click: () => mainWindow.webContents.send('loadview', 'tageditor'),
                    label: 'Editor de etiquetas',
                },
                { type: 'separator' },
                { role: 'quit', label: "Salir" }
            ]
        }
    ])
    Menu.setApplicationMenu(menu)
    mainWindow.loadFile(
        path.join(__dirname, '../dist/youtube-to-mp3/index.html')
    )
}

async function handleSelectFolder() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    const folder = canceled ? null : filePaths[0]
    // Guardar carpeta seleccionada
    if (folder) {
        store.set('download-folder', folder)
    }
    return folder
}

function handleGetFromStorage(event, key) {
    const val = store.get(key) ?? null
    return val
}

app.whenReady().then(() => {
    ipcMain.handle('yt:downloadAudio', handleYoutubeDownloadAudio)
    ipcMain.handle('dialog:selectFolder', handleSelectFolder)
    ipcMain.handle('storage:get', handleGetFromStorage)
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})