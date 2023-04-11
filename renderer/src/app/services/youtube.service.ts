import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { IpcService } from './ipc.service';
import { Paginator } from '../models/paginator';
import { DownloadInfo, IYoutubeApiResponse, IYoutubeSearchParams, SearchType, YoutubeItem } from '../models/youtube-search';

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {
    private downloadItems: YoutubeItem[] = [];
    private downloadItemsSubject: BehaviorSubject<YoutubeItem[]> = new BehaviorSubject<YoutubeItem[]>(this.downloadItems);
    public downloadItems$: Observable<YoutubeItem[]> = this.downloadItemsSubject.asObservable();
    public downloadFolder: string = '';
    public isDownloading: boolean = false;

    constructor(
        private apiService: ApiService,
        private ipcService: IpcService,
    ) { }

    public search(
        params: IYoutubeSearchParams,
        searchType: SearchType = "search"
    ): Observable<Paginator<YoutubeItem>> {
        const baseUrl = 'https://www.googleapis.com/youtube/v3/';
        return this.apiService.request<IYoutubeApiResponse>(
            'get', `${baseUrl}${searchType}`, params
        ).pipe(
            map(response => {
                return new Paginator(
                    response.items.map(i => YoutubeItem.fromJson(i, response.kind)),
                    response.pageInfo.totalResults,
                    response.nextPageToken ? true : false,
                    response.nextPageToken,
                    response.prevPageToken,
                )
            })
        );
    }

    public addItemToDownloadList(item: YoutubeItem) {
        const index = this.downloadItems.findIndex(i => i.videoId === item.videoId);
        if (index === -1) {
            this.downloadItems.push(item);
            this.downloadItemsSubject.next(this.downloadItems);
            this.ipcService.downloadAudio(item.videoId, item.snippet.title);
        }
    }

    public updateDownloadInfo(index: number, info: DownloadInfo) {
        if (index < 0) {
            return;
        }
        if (!this.isDownloading) {
            this.isDownloading = true;
        }
        this.downloadItems[index].downloadInfo = info;
        this.downloadItemsSubject.next(this.downloadItems);
    }

    public clearDownloads() {
        let items: YoutubeItem[] = [];
        this.downloadItems.forEach(item => {
            if (!(item.hasFinished() || item.isCanceled())) {
                items.push(item);
            }
        });
        this.downloadItems = [...items];
        if (this.downloadItems.length === 0) {
            this.isDownloading = false;
        }
        this.downloadItemsSubject.next(this.downloadItems);
    }
}