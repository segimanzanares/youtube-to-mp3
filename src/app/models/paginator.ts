export class Paginator<T> {
    constructor(
        public data: T[],
        public total: number,
        public hasMorePages?: boolean,
        public nextPageToken?: string,
        public prevPageToken?: string,
    ) { }
}