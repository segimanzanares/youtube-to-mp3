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
        public downloadInfo?: {
            progress: string;
            finished: boolean;
        }
    ) { }

    public static fromJson(data: IYoutubeItem, kind: string): YoutubeItem {
        return new YoutubeItem(
            ['youtube#playlistItemListResponse'].indexOf(kind) !== -1
                ? (data.snippet.resourceId?.videoId ?? '')
                : (typeof data.id === "string" ? data.id : data.id.videoId),
            data.snippet
        );
    }
}