import { Injectable, NgZone } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Observable } from 'rxjs';

interface CustomIpcRenderer extends IpcRenderer {
    downloadAudio: (link: string) => Promise<any>;
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

    public async downloadAudio(videoId: string): Promise<string> {
        if (!this.isElectron()) {
            return Promise.reject();
        }
        console.log("Request video: " + videoId)
        return await window.electronAPI.downloadAudio(videoId);
    }

    public removeAllListeners(channel: string): void {
        if (!this.isElectron()) {
            return;
        }
        window.electronAPI.removeAllListeners(channel);
    }
}
