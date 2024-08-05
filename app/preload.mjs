import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    downloadAudio: (videoId, title) => ipcRenderer.invoke('yt:downloadAudio', videoId, title),
    cancelDownload: (videoId) => ipcRenderer.invoke('yt:cancelDownload', videoId),
    selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
    readFolderAudioTags: () => ipcRenderer.invoke('tags:readFolderAudioTags'),
    readAudioTagsFromFilename: (filePaths) => ipcRenderer.invoke('tags:readAudioTagsFromFilename', filePaths),
    saveAudioTags: (audioFiles) => ipcRenderer.invoke('tags:saveAudioTags', audioFiles),
    readImageFile: () => ipcRenderer.invoke('dialog:readImageFile'),
    getFromStorage: (key) => ipcRenderer.invoke('storage:get', key),
    getAppVersion: () => ipcRenderer.invoke('app:getVersion')
})