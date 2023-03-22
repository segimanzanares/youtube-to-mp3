import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Paginator } from '../models/paginator';
import { IYoutubeApiResponse, IYoutubeSearchParams, YoutubeItem } from '../models/youtube-search';

@Injectable({
    providedIn: 'root'
})

export class YoutubeService {

    constructor(
        private apiService: ApiService
    ) { }

    public search(params: IYoutubeSearchParams): Promise<Paginator<YoutubeItem>> {
        return this.apiService.request<IYoutubeApiResponse>(
            'get',
            `https://youtube.googleapis.com/youtube/v3/search`,
            params
        ).then(response => {
            return new Paginator(
                response.items.map(i => YoutubeItem.fromJson(i)),
                response.pageInfo.totalResults,
                response.nextPageToken ? true : false,
                response.nextPageToken,
                response.prevPageToken,
            )
        });
    }
}