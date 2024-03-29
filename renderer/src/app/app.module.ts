import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Material
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './views/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YoutubePreviewDialogComponent } from './components/youtube-preview-dialog/youtube-preview-dialog.component';
import { YoutubeSearchComponent } from './components/youtube-search/youtube-search.component';
import { YoutubeDownloaderComponent } from './components/youtube-downloader/youtube-downloader.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { TagEditorComponent } from './views/tag-editor/tag-editor.component';
import { AudioTagsDialogComponent } from './components/audio-tags-dialog/audio-tags-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        YoutubePreviewDialogComponent,
        YoutubeSearchComponent,
        YoutubeDownloaderComponent,
        AlertDialogComponent,
        ConfirmDialogComponent,
        TagEditorComponent,
        AudioTagsDialogComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        MatTabsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatDialogModule,
        MatTableModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatBadgeModule,
        MatToolbarModule,
        MatTooltipModule,
        MatCheckboxModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
