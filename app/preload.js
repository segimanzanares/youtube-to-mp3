const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    downloadAudio: (...args) => ipcRenderer.invoke('yt:downloadAudio', ...args),
    selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
    getFromStorage: (key) => ipcRenderer.invoke('storage:get', key),
})