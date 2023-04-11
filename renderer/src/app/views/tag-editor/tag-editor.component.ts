import { showAudioTagsDialog } from '../../components/audio-tags-dialog/audio-tags-dialog.component';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AudioFile } from '../../models/audiofile';
import { IpcService } from '../../services/ipc.service';
import { showAlertDialog } from '../../utils';
import { AlertDialogComponent, AlertDialogType } from '../../components/alert-dialog/alert-dialog.component';

@Component({
    selector: 'app-tag-editor',
    templateUrl: './tag-editor.component.html',
    styleUrls: ['./tag-editor.component.scss']
})
export class TagEditorComponent {
    public directoryPath: string = '';
    public dataSource: MatTableDataSource<AudioFile>;
    public displayedColumns: string[] = ['name', 'title', 'artist', 'actions'];
    public saveEnabled: boolean = false;

    public constructor(
        private ipcService: IpcService,
        public dialog: MatDialog,
    ) {
        this.dataSource = new MatTableDataSource<AudioFile>([]);
    }

    public openFolder() {
        this.ipcService.readFolderAudioTags().then(response => {
            this.dataSource.data = [];
            if (response && response.length > 0) {
                this.directoryPath = response[0].path.substring(0, response[0].path.lastIndexOf('/'))
                this.dataSource.data = response;
            }
        })
    }

    public editTags(audio: AudioFile) {
        const config: MatDialogConfig = {
            width: '500px',
            disableClose: true,
        }
        showAudioTagsDialog(this.dialog, audio, (audioFile) => {
            audio = audioFile;
            const ref = this.showAlert("Guardando...");
            this.ipcService.saveAudioTags([audio])
                .then(() => this.showAlert("¡Las etiquetas se guardaron satisfactoriamente!", 'success', true))
                .finally(() => ref.close());
        }, config);
    }

    public extractFromFilename() {
        const ref = this.showAlert("Analizando...");
        this.ipcService.readAudioTagsFromFilename(this.dataSource.data)
            .then(response => {
                this.saveEnabled = true;
                this.dataSource.data = response;
            })
            .finally(() => ref.close());
    }

    public saveAll() {
        const ref = this.showAlert("Guardando...");
        this.ipcService.saveAudioTags(this.dataSource.data)
            .then(() => {
                this.showAlert("¡Las etiquetas se guardaron satisfactoriamente!", 'success', true);
                this.saveEnabled = false;
            })
            .finally(() => ref.close());
    }

    private showAlert(
        message: string,
        type: AlertDialogType = 'loading',
        showAcceptButton: boolean = false
    ): MatDialogRef<AlertDialogComponent> {
        return showAlertDialog(this.dialog, {
            data: {
                message: message,
                showAcceptButton: showAcceptButton,
                type: type,
            },
            disableClose: true,
        });
    }
}
