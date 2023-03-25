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

    constructor(
        private youtubeService: YoutubeService,
    ) {
        this.pendingItems$ = this.youtubeService.downloadItems$.pipe(
            map(items => items.filter(item => !item.hasFinished()))
        );
    }
}
