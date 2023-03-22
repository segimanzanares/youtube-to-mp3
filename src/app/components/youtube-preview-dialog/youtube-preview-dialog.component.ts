import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface DialogData {
    videoId: string;
}
@Component({
    selector: 'app-youtube-preview-dialog',
    templateUrl: './youtube-preview-dialog.component.html',
    styleUrls: ['./youtube-preview-dialog.component.scss']
})
export class YoutubePreviewDialogComponent {
    public videoUrl: SafeResourceUrl;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private sanitizer: DomSanitizer
    ) {
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + this.data.videoId);
    }
}
