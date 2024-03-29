export interface ID3ImageTag {
    mime: string;
    type: {
        id: number;
    },
    description?: string,
    imageBuffer: Buffer
}
export interface ID3Tags {
    title?: string;
    artist?: string;
    album?: string;
    genre?: string;
    year?: number;
    image?: ID3ImageTag;
}
export interface IAudioFile {
    path: string;
    name?: string;
    tags: ID3Tags;
}

export class AudioFile {
    public constructor(
        public path: string,
        public name: string,
        public tags: ID3Tags,
    ) { }

    public static fromJson(data: IAudioFile): AudioFile {
        return new AudioFile(
            data.path,
            data.name ?? data.path.substring(data.path.lastIndexOf('/') + 1),
            data.tags,
        );
    }
}