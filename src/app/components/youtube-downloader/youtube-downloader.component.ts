import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { DownloadInfo, YoutubeItem } from './../../models/youtube-search';
import { IpcService } from './../../services/ipc.service';
import { YoutubeService } from './../../services/youtube.service';

@Component({
    selector: 'app-youtube-downloader',
    templateUrl: './youtube-downloader.component.html',
    styleUrls: ['./youtube-downloader.component.scss']
})
export class YoutubeDownloaderComponent implements OnInit, OnDestroy {
    public audioProgress$?: Observable<string>;
    public downloadSubscription?: Subscription;
    public downloadItemsSubscription?: Subscription;
    public dataSource: MatTableDataSource<YoutubeItem>;
    public displayedColumns: string[] = ['title', 'channelTitle', 'progress'];

    constructor(
        private ipcService: IpcService,
        private youtubeService: YoutubeService,
    ) {
        this.dataSource = new MatTableDataSource<YoutubeItem>([]);
        this.downloadItemsSubscription = this.youtubeService.downloadItems$
            .subscribe(result => {
                this.dataSource.data = result;
            });
    }

    ngOnInit(): void {
        this.listenAudioProgress();
        this.ipcService.getFromStorage('download-folder')
            .then(response => {
                if (response) {
                    this.downloadFolder = response;
                }
            });
    }

    ngOnDestroy(): void {
        this.ipcService.removeAllListeners('audioprogress');
        if (this.downloadSubscription) {
            this.downloadSubscription.unsubscribe();
        }
        if (this.downloadItemsSubscription) {
            this.downloadItemsSubscription.unsubscribe();
        }
    }

    public get downloadFolder(): string {
        return this.youtubeService.downloadFolder;
    }

    public set downloadFolder(value: string) {
        this.youtubeService.downloadFolder = value;
    }

    public listenAudioProgress() {
        if (!this.ipcService.isElectron()) {
            return;
        }
        this.downloadSubscription = this.ipcService
            .on('audioprogress')
            .subscribe(result => {
                const info: DownloadInfo = JSON.parse(result);
                if (!info) {
                    return;
                }
                const index = this.dataSource.data.findIndex(item => item.videoId === info.videoId);
                if (index === -1) {
                    return;
                }
                this.youtubeService.updateDownloadInfo(index, info);
            })
    }

    public selectFolder() {
        this.ipcService.openFolder().then(response => {
            if (response) {
                this.downloadFolder = response;
            }
        })
    }
}
