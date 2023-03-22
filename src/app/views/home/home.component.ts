import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IYoutubeSearchParams, YoutubeItem } from './../../models/youtube-search';
import { Paginator } from './../../models/paginator';
import { YoutubeService } from './../../services/youtube.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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
    ) {
        this.form = this.fb.group({
            query: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        //
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
}
