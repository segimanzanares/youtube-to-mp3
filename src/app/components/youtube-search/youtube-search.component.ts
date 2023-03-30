import { Component } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Paginator } from './../../models/paginator';
import { YoutubeItem, IYoutubeSearchParams, SearchType } from './../../models/youtube-search';
import { YoutubeService } from './../../services/youtube.service';
import { IpcService } from './../../services/ipc.service';
import { environment } from './../../../environments/environment';
import { YoutubePreviewDialogComponent } from '../youtube-preview-dialog/youtube-preview-dialog.component';
import { showAlertDialog, showConfirmDialog } from './../../utils';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

interface SearchForm {
    query: FormControl<string>;
}

@Component({
    selector: 'app-youtube-search',
    templateUrl: './youtube-search.component.html',
    styleUrls: ['./youtube-search.component.scss']
})
export class YoutubeSearchComponent {

    public form: FormGroup<SearchForm>;
    public searchResults!: Paginator<YoutubeItem>;
    public searchParams: IYoutubeSearchParams = {
        part: 'snippet',
        key: environment.googleApiKey,
        q: '',
        type: 'video',
        maxResults: 25,
    };
    public searchType: SearchType = 'search';

    constructor(
        private youtubeService: YoutubeService,
        private ipcService: IpcService,
        public dialog: MatDialog,
    ) {
        this.form = new FormGroup<SearchForm>({
            query: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        });
    }

    public searchVideos() {
        if (!this.form.valid) {
            return;
        }
        const q = this.form.value.query;
        this.searchType = 'search';
        this.searchParams.playlistId = void 0;
        this.searchParams.id = void 0;
        if (q && q.startsWith('https://www.youtube.com/playlist?list=')) {
            const params = new URLSearchParams(q.split('?')[1]);
            const playlistId = params.get('list') ?? '';
            this.searchType = 'playlistItems';
            this.searchParams.playlistId = playlistId;
        }
        else if (q && (q.startsWith('https://www.youtube.com/watch?v=') || q.startsWith('https://youtu.be/'))) {
            let videoId: string;
            if (q.startsWith('https://youtu.be/')) {
                videoId = q.replace('https://youtu.be/', '');
            }
            else {
                const params = new URLSearchParams(q.split('?')[1]);
                videoId = params.get('v') ?? '';
            }
            this.searchType = 'videos';
            this.searchParams.id = videoId;
        }
        if (q && this.searchType === 'search') {
            this.searchParams.q = q;
        }
        const ref = this.displayLoadingSpinner();
        this.youtubeService.search(this.searchParams, this.searchType)
            .subscribe({
                next: response => this.searchResults = response,
                complete: () => ref.close(),
            });
    }

    public paginate(page?: 'next' | 'prev') {
        if (page === 'next' || page === 'prev') {
            this.searchParams.pageToken = page === 'next'
                ? this.searchResults?.nextPageToken
                : this.searchResults?.prevPageToken;
        }
        const ref = this.displayLoadingSpinner();
        this.youtubeService.search(this.searchParams, this.searchType)
            .subscribe({
                next: response => this.searchResults = response,
                complete: () => ref.close(),
            });
    }

    private displayLoadingSpinner(): MatDialogRef<AlertDialogComponent> {
        const ref = showAlertDialog(this.dialog, {
            data: {
                message: "Buscando...",
                showAcceptButton: false,
                type: 'loading',
            },
            disableClose: true,
        });
        return ref;
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
                videoId: item.videoId,
            },
        });
    }

    public download(item: YoutubeItem) {
        if (!this.youtubeService.downloadFolder) {
            this.ipcService.openFolder().then(response => {
                if (response) {
                    this.youtubeService.downloadFolder = response;
                    this.youtubeService.addItemToDownloadList(item);
                }
            })
        }
        else {
            this.youtubeService.addItemToDownloadList(item);
        }
    }

    public downloadAll() {
        const self = this;
        showConfirmDialog(this.dialog, {
            disableClose: true,
            data: {
                title: "Descargar todo",
                message: "¿Estás seguro de descargar todos los elementos de la lista?",
                confirmButtonText: "Sí",
                cancelButtonText: "Cancelar",
                callback: () => self.searchResults?.data.forEach(item => self.download(item)),
            }
        })
    }
}
