export interface IYoutubeSearchParams {
    q: string;
    key: string;
    part: 'snippet' | 'id';
    maxResults: number;
    type?: string;
    pageToken?: string;
    playlistId?: string;
}

export interface IYoutubeItem {
    id: {
        videoId: string;
    } | string;
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        channelTitle: string;
        resourceId?: {
            videoId: string;
        }
    };
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
        public snippet?: {
            publishedAt: string;
            channelId: string;
            title: string;
            description: string;
            channelTitle: string;
        },
        public downloadInfo?: {
            progress: string;
            finished: boolean;
        }
    ) { }

    public static fromJson(data: IYoutubeItem, kind: string): YoutubeItem {
        return new YoutubeItem(
            kind === 'youtube#playlistItemListResponse'
                ? (data.snippet.resourceId?.videoId ?? '')
                : (typeof data.id === "string" ? data.id : data.id['videoId']),
            data.snippet
        );
    }
}