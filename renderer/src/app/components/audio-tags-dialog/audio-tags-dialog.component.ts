import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AudioFile, ID3ImageTag, ID3Tags } from './../../models/audiofile';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IpcService } from './../../services/ipc.service';

type AudioTagsForm = {
    [Property in keyof ID3Tags]?: FormControl<ID3Tags[Property] | null>;
}

@Component({
    selector: 'app-audio-tags-dialog',
    templateUrl: './audio-tags-dialog.component.html',
    styleUrls: ['./audio-tags-dialog.component.scss']
})
export class AudioTagsDialogComponent implements OnInit {
    public audioFiles!: AudioFile[];
    public form: FormGroup<AudioTagsForm>;
    public maxYear: number;
    public cover?: string;
    public imageBuffer?: ID3ImageTag;
    public editMultiple = false;

    constructor(
        public dialogRef: MatDialogRef<AudioTagsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AudioFile[],
        private ipcService: IpcService,
    ) {
        this.audioFiles = this.data;
        this.editMultiple = this.audioFiles.length > 1;
        this.form = new FormGroup<AudioTagsForm>({
            title: new FormControl(
                this.audioFiles[0].tags.title ?? '',
                {
                    nonNullable: !this.editMultiple,
                    validators: !this.editMultiple ? [Validators.required] : null
                }
            ),
            artist: new FormControl(
                this.audioFiles[0].tags.artist ?? '',
                {
                    nonNullable: !this.editMultiple,
                    validators: !this.editMultiple ? [Validators.required] : null
                }
            ),
            album: new FormControl(this.audioFiles[0].tags.album ?? '', { nonNullable: false }),
            genre: new FormControl(this.audioFiles[0].tags.genre ?? '', { nonNullable: false }),
            year: new FormControl(this.audioFiles[0].tags.year ?? null, { nonNullable: false }),
        });
        this.maxYear = new Date().getFullYear();
        if (!this.editMultiple && this.audioFiles[0].tags.image) {
            this.cover = URL.createObjectURL(
                new Blob([this.audioFiles[0].tags.image.imageBuffer], { type: this.audioFiles[0].tags.image.mime })
            );
        }
    }

    ngOnInit(): void { }

    public onSaveClick(): void {
        if (!this.form.valid) {
            return;
        }
        this.audioFiles.map(audioFile => {
            if (!this.editMultiple) {
                audioFile.tags.title = this.form.value.title ?? void 0;
                audioFile.tags.artist = this.form.value.artist ?? void 0;
            }
            audioFile.tags.album = this.form.value.album ?? void 0;
            audioFile.tags.genre = this.form.value.genre ?? void 0;
            audioFile.tags.year = this.form.value.year ?? void 0;
            if (this.imageBuffer) {
                audioFile.tags.image = this.imageBuffer;
            }
        });
        this.dialogRef.close(this.audioFiles);
    }

    public onCancelClick(): void {
        this.dialogRef.close();
    }

    public onExtractClick(): void {
        this.ipcService.readAudioTagsFromFilename([this.audioFiles[0]])
            .then(response => {
                this.form.get('title')?.setValue(response[0].tags.title);
                this.form.get('artist')?.setValue(response[0].tags.artist);
            });
    }

    public readImageFile() {
        this.ipcService.readImageFile().then(response => {
            if (!response) {
                return;
            }
            this.cover = URL.createObjectURL(
                new Blob([response.buffer], { type: response.mime })
            );
            this.imageBuffer = {
                mime: response.mime,
                type: {id: 3},
                imageBuffer: response.buffer,
                description: "Cover",
            };
        });
    }
}

export const showAudioTagsDialog = (
    dialog: MatDialog,
    audioFiles: AudioFile[],
    onSave: (audioFiles: AudioFile[]) => void,
    config?: MatDialogConfig<AudioFile>
) => {
    const dialogRef = dialog.open(AudioTagsDialogComponent, {
        data: audioFiles,
        width: config?.width ?? '350px',
        disableClose: config?.disableClose ?? false,
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            onSave(result);
        }
    });
};