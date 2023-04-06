export type SearchType = 'search' | 'playlistItems' | 'videos';

export interface IYoutubeSearchParams {
    q: string;
    key: string;
    part: 'snippet' | 'id';
    maxResults: number;
    type?: string;
    pageToken?: string;
    playlistId?: string;
    id?: string;
}

interface Thumbnail {
    width: number;
    height: number;
    url: string;
}

interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
        default: Thumbnail;
        medium: Thumbnail;
        high: Thumbnail;
    },
    resourceId?: {
        videoId: string;
    }
}

export interface DownloadInfo {
    videoId: string;
    title: string;
    startedAt: number;
    finishedAt: number;
    status: string;
    details: string;
}

export interface IYoutubeItem {
    id: {
        videoId: string;
    } | string;
    snippet: Snippet
}

export interface IYoutubeApiResponse {
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    },
    nextPageToken?: string;
    prevPageToken?: string;
    items: IYoutubeItem[];
    kind: string;
}

export class YoutubeItem {
    constructor(
        public videoId: string,
        public snippet: Snippet,
        public downloadInfo?: DownloadInfo
    ) { }

    public static fromJson(data: IYoutubeItem, kind: string): YoutubeItem {
        return new YoutubeItem(
            ['youtube#playlistItemListResponse'].indexOf(kind) !== -1
                ? (data.snippet.resourceId?.videoId ?? '')
                : (typeof data.id === "string" ? data.id : data.id.videoId),
            data.snippet
        );
    }

    public hasFinished(): boolean {
        return ['finished', 'error'].indexOf(this.downloadInfo?.status ?? '') !== -1;
    }

    public hasFinishedWithoutErrors() {
        return this.downloadInfo?.status === 'finished';
    }

    public isDownloading(): boolean {
        return this.downloadInfo?.status === 'downloading';
    }

    public hasError(): boolean {
        return this.downloadInfo?.status === 'error';
    }
}