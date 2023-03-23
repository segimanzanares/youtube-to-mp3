import { YoutubeService } from './../../services/youtube.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { YoutubeItem } from './../../models/youtube-search';
import { IpcService } from './../../services/ipc.service';
import { MatTableDataSource } from '@angular/material/table';

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

    public listenAudioProgress() {
        if (!this.ipcService.isElectron()) {
            return;
        }
        this.downloadSubscription = this.ipcService
            .on('audioprogress')
            .subscribe(result => {
                const obj = JSON.parse(result);
                if (!obj) {
                    return;
                }
                const index = this.dataSource.data.findIndex(item => item.videoId === obj.videoId);
                if (index === -1) {
                    return;
                }
                this.dataSource.data[index].downloadInfo = {
                    progress: obj.details,
                    finished: obj.finishedAt ? true : false,
                };
            })
    }
}
