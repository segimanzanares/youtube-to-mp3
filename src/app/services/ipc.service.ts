import { Injectable, NgZone } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Observable } from 'rxjs';
import { AudioFile, IAudioFile } from '../models/audiofile';

interface CustomIpcRenderer extends IpcRenderer {
    downloadAudio: (...params: string[]) => Promise<any>;
    selectFolder: () => Promise<string>;
    readFolderAudioTags: () => Promise<IAudioFile[]>;
    readAudioTagsFromFilename:(filePaths: string[]) => Promise<IAudioFile[]>;
    getFromStorage: (key: string) => Promise<string>;
}

declare global {
    interface Window {
        electronAPI: CustomIpcRenderer;
    }
}

@Injectable({
    providedIn: 'root',
})
export class IpcService {
    constructor(private ngZone: NgZone) { }

    public isElectron(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.includes(' electron/');
    }

    public on(channel: string): Observable<string> {
        return new Observable((observer) => {
            window.electronAPI.on(channel, (_event: any, payload: any) => {
                this.ngZone.run(() => observer.next(payload));
            });
        });
    }

    public send(channel: string, ...args: any[]): void {
        if (!this.isElectron()) {
            return;
        }
        window.electronAPI.send(channel, ...args);
    }

    public async downloadAudio(videoId: string, title: string): Promise<string> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        return await window.electronAPI.downloadAudio(videoId, title);
    }

    public removeAllListeners(channel: string): void {
        if (!this.isElectron()) {
            return;
        }
        window.electronAPI.removeAllListeners(channel);
    }

    public async selectFolder(): Promise<string> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        return await window.electronAPI.selectFolder();
    }

    public async readFolderAudioTags(): Promise<AudioFile[]> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        return await window.electronAPI.readFolderAudioTags()
            .then(arr => arr.map(a => AudioFile.fromJson(a)));
    }

    public async readAudioTagsFromFilename(files: AudioFile[]): Promise<AudioFile[]> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        return await window.electronAPI.readAudioTagsFromFilename(files.map(f => f.path))
            .then(arr => arr.map(a => AudioFile.fromJson(a)));
    }

    public async getFromStorage(key: string): Promise<string> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        return await window.electronAPI.getFromStorage(key);
    }
}
