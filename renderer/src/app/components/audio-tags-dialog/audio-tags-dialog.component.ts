import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AudioFile, ID3Tags } from './../../models/audiofile';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IpcService } from './../../services/ipc.service';

type AudioTagsForm = {
    [Property in keyof ID3Tags]-?: FormControl<ID3Tags[Property] | null>;
}

@Component({
    selector: 'app-audio-tags-dialog',
    templateUrl: './audio-tags-dialog.component.html',
    styleUrls: ['./audio-tags-dialog.component.scss']
})
export class AudioTagsDialogComponent implements OnInit {
    public audioFile!: AudioFile;
    public form: FormGroup<AudioTagsForm>;
    public maxYear: number;

    constructor(
        public dialogRef: MatDialogRef<AudioTagsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AudioFile,
        private ipcService: IpcService,
    ) {
        this.audioFile = this.data;
        this.form = new FormGroup<AudioTagsForm>({
            title: new FormControl(this.audioFile.tags.title ?? '', { nonNullable: true, validators: [Validators.required] }),
            artist: new FormControl(this.audioFile.tags.artist ?? '', { nonNullable: true, validators: [Validators.required] }),
            album: new FormControl(this.audioFile.tags.album ?? '', { nonNullable: false }),
            genre: new FormControl(this.audioFile.tags.genre ?? '', { nonNullable: false }),
            year: new FormControl(this.audioFile.tags.year ?? null, { nonNullable: false }),
        });
        this.maxYear = new Date().getFullYear();
    }

    ngOnInit(): void { }

    public onSaveClick(): void {
        if (!this.form.valid) {
            return;
        }
        this.audioFile.tags.title = this.form.value.title ?? void 0;
        this.audioFile.tags.artist = this.form.value.artist ?? void 0;
        this.audioFile.tags.album = this.form.value.album ?? void 0;
        this.audioFile.tags.genre = this.form.value.genre ?? void 0;
        this.audioFile.tags.year = this.form.value.year ?? void 0;
        this.dialogRef.close(this.audioFile);
    }

    public onCancelClick(): void {
        this.dialogRef.close();
    }

    public onExtractClick(): void {
        this.ipcService.readAudioTagsFromFilename([this.audioFile])
            .then(response => {
                this.form.get('title')?.setValue(response[0].tags.title);
                this.form.get('artist')?.setValue(response[0].tags.artist);
            });
    }
}

export const showAudioTagsDialog = (
    dialog: MatDialog,
    audioFile: AudioFile,
    onSave: (audioFile: AudioFile) => void,
    config?: MatDialogConfig<AudioFile>
) => {
    const dialogRef = dialog.open(AudioTagsDialogComponent, {
        data: audioFile,
        width: config?.width ?? '350px',
        disableClose: config?.disableClose ?? false,
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            onSave(result);
        }
    });
};