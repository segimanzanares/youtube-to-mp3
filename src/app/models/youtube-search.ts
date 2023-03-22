export interface IYoutubeSearchParams {
    q: string;
    key: string;
    part: 'snippet' | 'id';
    maxResults: number;
    pageToken?: string;
}

export interface IYoutubeItem {
    id: {
        videoId: string;
    };
    snippet?: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        channelTitle: string;
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
}

export class YoutubeItem implements IYoutubeItem {
    constructor(
        public id: {
            videoId: string;
        },
        public snippet?: {
            publishedAt: string;
            channelId: string;
            title: string;
            description: string;
            channelTitle: string;
        }
    ) { }

    public static fromJson(data: IYoutubeItem): YoutubeItem {
        return new YoutubeItem(
            data.id,
            data.snippet
        );
    }
}