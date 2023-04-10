import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AudioFile } from '../../models/audiofile';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface AudioTagsForm {
    title: FormControl<string>;
    artist: FormControl<string>;
}

@Component({
    selector: 'app-audio-tags-dialog',
    templateUrl: './audio-tags-dialog.component.html',
    styleUrls: ['./audio-tags-dialog.component.scss']
})
export class AudioTagsDialogComponent implements OnInit {
    public audioFile!: AudioFile;
    public form: FormGroup<AudioTagsForm>;

    constructor(
        public dialogRef: MatDialogRef<AudioTagsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AudioFile
    ) {
        this.audioFile = this.data;
        this.form = new FormGroup<AudioTagsForm>({
            title: new FormControl(this.audioFile.tags.title ?? '', { nonNullable: true, validators: [Validators.required] }),
            artist: new FormControl(this.audioFile.tags.artist ?? '', { nonNullable: true, validators: [Validators.required] }),
        });
    }

    ngOnInit(): void { }

    public onSaveClick(): void {
        if (!this.form.valid) {
            return;
        }
        this.audioFile.tags.title = this.form.value.title;
        this.audioFile.tags.artist = this.form.value.artist;
        this.dialogRef.close(this.audioFile);
    }

    public onCancelClick(): void {
        this.dialogRef.close();
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