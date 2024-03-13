import { Injectable, NgZone } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Observable } from 'rxjs';
import { AudioFile, IAudioFile } from '../models/audiofile';
import { DownloadInfo } from '../models/youtube-search';

interface ImageBuffer {
    mime: string;
    buffer: Buffer;
}

interface CustomIpcRenderer extends IpcRenderer {
    downloadAudio: (videoId: string, title: string) => Promise<DownloadInfo>;
    cancelDownload: (videoId: string) => Promise<boolean>;
    selectFolder: () => Promise<string>;
    readFolderAudioTags: () => Promise<IAudioFile[]>;
    readAudioTagsFromFilename: (filePaths: string[]) => Promise<IAudioFile[]>;
    saveAudioTags: (audioFiles: IAudioFile[]) => Promise<boolean>;
    readImageFile: () => Promise<ImageBuffer>;
    getFromStorage: (key: string) => Promise<string>;
    getAppVersion: () => Promise<string>;
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

    public async downloadAudio(videoId: string, title: string): Promise<DownloadInfo> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        return await window.electronAPI.downloadAudio(videoId, title);
    }

    public async cancelDownload(videoId: string): Promise<boolean> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        return await window.electronAPI.cancelDownload(videoId);
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

    public async readImageFile(): Promise<ImageBuffer> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        return await window.electronAPI.readImageFile();
    }

    public async readFolderAudioTags(): Promise<AudioFile[]> {
        /*return [
            {
                path: "/home/segi/Música/Banda Beats/Banda Beats Vol. 8/3ER Elemento - Ojitos De Miel (Segi Manzanares Remix).mp3",
                name: "3ER Elemento - Ojitos De Miel (Segi Manzanares Remix).mp3",
                tags: {
                    title: "Ojitos De Miel (Segi Manzanares Remix)",
                    artist: "3ER Elemento",
                    album: "Banda Beats Vol. 8",
                    year: 2024
                }
            },
            {
                path: "/home/segi/Música/Banda Beats/Banda Beats Vol. 8/Banda Los Recoditos - Hasta Que Salga El Sol (Segi Manzanares Remix).mp3",
                name: "Banda Los Recoditos - Hasta Que Salga El Sol (Segi Manzanares Remix).mp3",
                tags: {
                    title: "Hasta que salga el sol (Segi Manzanares Remix)",
                    artist: "Banda Los Recoditos",
                    album: "Banda Beats Vol. 8",
                    year: 2024
                }
            },
            {
                path: "/home/segi/Música/Banda Beats/Banda Beats Vol. 8/Edén Muñoz - Sueño Guajiro (Segi Manzanares Remix).mp3",
                name: "Edén Muñoz - Sueño Guajiro (Segi Manzanares Remix).mp3",
                tags: {
                    title: "Sueño Guajiro (Segi Manzanares Remix)",
                    artist: "Edén Muñoz",
                    album: "Banda Beats Vol. 8",
                    year: 2024
                }
            },
            {
                path: "/home/segi/Música/Banda Beats/Banda Beats Vol. 8/Gerardo Ortiz - Damaso (Segi Manzanares Remix).mp3",
                name: "Gerardo Ortiz - Damaso (Segi Manzanares Remix).mp3",
                tags: {
                    title: "Damaso (Segi Manzanares Remix)",
                    artist: "Gerardo Ortiz",
                    album: "Banda Beats Vol. 8",
                    year: 2024
                }
            },
            {
                path: "/home/segi/Música/Banda Beats/Banda Beats Vol. 8/Julión Álvarez Y Su Norteño Banda - Eres Todo Todo (Segi Manzanares Remix).mp3",
                name: "Julión Álvarez Y Su Norteño Banda - Eres Todo Todo (Segi Manzanares Remix).mp3",
                tags: {
                    title: "Eres Todo Todo (segi Manzanares Remix)",
                    artist: "Julión Álvarez Y Su Norteño Banda",
                    album: "Banda Beats Vol. 8",
                    year: 2024
                }
            },
            {
                path: "/home/segi/Música/Banda Beats/Banda Beats Vol. 8/Los Temerarios - Acepta Mi Error (Segi Manzanares Remix).mp3",
                name: "Los Temerarios - Acepta Mi Error (Segi Manzanares Remix).mp3",
                tags: {
                    title: "Acepta Mi Error (Segi Manzanares Remix)",
                    artist: "Los Temerarios",
                    album: "Banda Beats Vol. 8",
                    year: 2024
                }
            },
            {
                path: "/home/segi/Música/Banda Beats/Banda Beats Vol. 8/Sergio Vega - Cuando El Sol Salga Al Revés (Segi Manzanares Remix).mp3",
                name: "Sergio Vega - Cuando El Sol Salga Al Revés (Segi Manzanares Remix).mp3",
                tags: {
                    title: "Cuando El Sol Salga Al Revés (Segi Manzanares Remix)",
                    artist: "Sergio Vega",
                    album: "Banda Beats Vol. 8",
                    year: 2024
                }
            },
            {
                path: "/home/segi/Música/Banda Beats/Banda Beats Vol. 8/Xavi - La Diabla (Segi Manzanares Remix).mp3",
                name: "Xavi - La Diabla (Segi Manzanares Remix).mp3",
                tags: {
                    title: "La Diabla (Segi Manzanares Remix)",
                    artist: "Xavi",
                    album: "Banda Beats Vol. 8",
                    year: 2024
                }
            }
        ];*/
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

    public async saveAudioTags(files: IAudioFile[]): Promise<boolean> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        return await window.electronAPI.saveAudioTags(files)
    }

    public async getFromStorage(key: string): Promise<string> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        return await window.electronAPI.getFromStorage(key);
    }

    public async getAppVersion(): Promise<string> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        return await window.electronAPI.getAppVersion();
    }
}
