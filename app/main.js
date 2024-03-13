const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const Store = require("electron-store");
const path = require('path')
const fs = require('fs')
const mime = require('mime');
const { handleYoutubeDownloadAudio, handleCancelDownload } = require('./downloader')
const { readDirectoryAudioTags, readTagsFromFileName, saveAudioTags } = require('./id3editor');
const store = new Store();

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets/images/icon.png')
    })
    const menu = Menu.buildFromTemplate([
        {
            label: "Archivo",
            submenu: [
                {
                    click: () => mainWindow.webContents.send('loadview', 'home'),
                    label: 'Descargar audio MP3',
                },
                {
                    click: () => mainWindow.webContents.send('loadview', 'tageditor'),
                    label: 'Editor de etiquetas MP3',
                },
                { type: 'separator' },
                { role: 'quit', label: "Salir" }
            ]
        },
        {
            label: "Ayuda",
            submenu: [
                {
                    click: () => mainWindow.webContents.send('loadview', 'about'),
                    label: 'Acerca de',
                },
            ]
        }
    ])
    Menu.setApplicationMenu(menu)
    mainWindow.loadFile(
        path.join(__dirname, '../dist/index.html')
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

async function handleReadFolderAudioTags() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    const folder = canceled ? null : filePaths[0]
    if (!folder) {
        return null
    }
    return readDirectoryAudioTags(folder)
}

async function handleReadImageFile() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
            extensions: ['png', 'jpg', 'jpeg'],
            name: "Archivos de imagen",
        }]
    })
    if (canceled) {
        return null;
    }
    return {
        buffer: fs.readFileSync(filePaths[0]),
        mime: mime.getType(filePaths[0])
    }
}

async function handleReadAudioTagsFromFilename(event, filePaths) {
    if (!filePaths) {
        return []
    }
    return filePaths.map(f => ({
        path: f,
        name: path.basename(f),
        tags: readTagsFromFileName(f),
    }))
}

async function handleSaveAudioTags(event, audioFiles) {
    if (!audioFiles) {
        return false
    }
    audioFiles.forEach(f => saveAudioTags(f))
    return true
}

function handleGetFromStorage(event, key) {
    const val = store.get(key) ?? null
    return val
}

function handleGetAppVersion() {
    return app.getVersion()
}

app.whenReady().then(() => {
    ipcMain.handle('yt:downloadAudio', handleYoutubeDownloadAudio)
    ipcMain.handle('yt:cancelDownload', handleCancelDownload)
    ipcMain.handle('dialog:selectFolder', handleSelectFolder)
    ipcMain.handle('tags:readFolderAudioTags', handleReadFolderAudioTags)
    ipcMain.handle('tags:readAudioTagsFromFilename', handleReadAudioTagsFromFilename)
    ipcMain.handle('tags:saveAudioTags', handleSaveAudioTags)
    ipcMain.handle('dialog:readImageFile', handleReadImageFile)
    ipcMain.handle('storage:get', handleGetFromStorage)
    ipcMain.handle('app:getVersion', handleGetAppVersion)
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})