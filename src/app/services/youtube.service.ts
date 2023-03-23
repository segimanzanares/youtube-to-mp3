import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { IpcService } from './ipc.service';
import { Paginator } from '../models/paginator';
import { IYoutubeApiResponse, IYoutubeSearchParams, SearchType, YoutubeItem } from '../models/youtube-search';

@Injectable({
    providedIn: 'root'
})

export class YoutubeService {
    private downloadItems: YoutubeItem[] = [];
    private downloadItemsSubject: BehaviorSubject<YoutubeItem[]> = new BehaviorSubject<YoutubeItem[]>(this.downloadItems);
    public downloadItems$: Observable<YoutubeItem[]> = this.downloadItemsSubject.asObservable();

    constructor(
        private apiService: ApiService,
        private ipcService: IpcService,
    ) { }

    public search(
        params: IYoutubeSearchParams,
        searchType: SearchType = "search"
    ): Promise<Paginator<YoutubeItem>> {
        const baseUrl = 'https://www.googleapis.com/youtube/v3/';
        return this.apiService.request<IYoutubeApiResponse>('get', `${baseUrl}${searchType}`, params).then(response => {
            return new Paginator(
                response.items.map(i => YoutubeItem.fromJson(i, response.kind)),
                response.pageInfo.totalResults,
                response.nextPageToken ? true : false,
                response.nextPageToken,
                response.prevPageToken,
            )
        });
    }

    public addItemToDownloadList(item: YoutubeItem) {
        this.downloadItems.push(item);
        this.downloadItemsSubject.next(this.downloadItems);
        //this.ipcService.downloadAudio(item.id.videoId);
    }
}