import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { YoutubeItem } from './../../models/youtube-search';
import { YoutubeService } from './../../services/youtube.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    public pendingItems$: Observable<YoutubeItem[]>;
    public selectedTabIndex: number = 0;

    constructor(
        private youtubeService: YoutubeService,
    ) {
        this.pendingItems$ = this.youtubeService.downloadItems$.pipe(
            map(items => items.filter(item => !item.hasFinished()))
        );
        this.pendingItems$.subscribe(items => {
            if (this.youtubeService.hasDownloaded && items.length === 0) {
                new Notification("Descarga de MP3", {
                    body: "Todas las descargas fueron finalizadas",
                    icon: "assets/images/icon.png",
                }).onclick = () => this.selectedTabIndex = 1
            }
        });
    }
}
