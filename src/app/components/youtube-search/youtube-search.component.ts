import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Paginator } from './../../models/paginator';
import { YoutubeItem, IYoutubeSearchParams } from './../../models/youtube-search';
import { YoutubeService } from './../../services/youtube.service';
import { environment } from './../../../environments/environment';
import { YoutubePreviewDialogComponent } from '../youtube-preview-dialog/youtube-preview-dialog.component';

@Component({
  selector: 'app-youtube-search',
  templateUrl: './youtube-search.component.html',
  styleUrls: ['./youtube-search.component.scss']
})
export class YoutubeSearchComponent {

    public form: UntypedFormGroup;
    public searchResults?: Paginator<YoutubeItem>;
    public searchParams: IYoutubeSearchParams = {
        part: 'snippet',
        key: environment.googleApiKey,
        q: '',
        maxResults: 25,
    };

    constructor(
        private fb: UntypedFormBuilder,
        private youtubeService: YoutubeService,
        public dialog: MatDialog,
    ) {
        this.form = this.fb.group({
            query: ['', Validators.required],
        });
    }

    public searchVideos() {
        const q = this.form.value.query;
        this.searchParams.q = q;
        this.youtubeService.search(this.searchParams)
            .then(result => {
                this.searchResults = result;
            });
    }

    public paginate(page?: 'next' | 'prev') {
        if (page === 'next' || page === 'prev') {
            this.searchParams.pageToken = page === 'next'
                ? this.searchResults?.nextPageToken
                : this.searchResults?.prevPageToken;
        }
        this.youtubeService.search(this.searchParams)
            .then(result => {
                this.searchResults = result;
            });
    }

    public handlePageEvent(e: PageEvent) {
        this.searchParams.pageToken = void 0;
        this.searchParams.maxResults = e.pageSize;
        if (e.previousPageIndex != null) {
            if (e.previousPageIndex < e.pageIndex) {
                // Ir a la página siguiente
                return this.paginate('next');
            }
            else if (e.previousPageIndex > e.pageIndex) {
                // Ir a la página anterior
                return this.paginate('prev');
            }
        }
        return this.paginate();
    }

    public openPreview(item: YoutubeItem) {
        this.dialog.open(YoutubePreviewDialogComponent, {
            data: {
                videoId: item.id.videoId,
            },
        });
    }
}