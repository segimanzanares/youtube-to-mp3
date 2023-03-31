import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AudioFile } from './../../models/audiofile';
import { IpcService } from './../../services/ipc.service';

@Component({
    selector: 'app-tag-editor',
    templateUrl: './tag-editor.component.html',
    styleUrls: ['./tag-editor.component.scss']
})
export class TagEditorComponent {
    public directoryPath: string = '';
    public dataSource: MatTableDataSource<AudioFile>;
    public displayedColumns: string[] = ['name', 'title', 'artist', 'actions'];

    public constructor(
        private ipcService: IpcService,
    ) {
        this.dataSource = new MatTableDataSource<AudioFile>([]);
    }

    public openFolder() {
        this.ipcService.readAudioTagsFromFolder().then(response => {
            this.dataSource.data = [];
            if (response && response.length > 0) {
                console.log(JSON.stringify(response))
                this.directoryPath = response[0].path.substring(0, response[0].path.lastIndexOf('/'))
                this.dataSource.data = response;
            }
        })
    }

    public editTags(audio: AudioFile) {

    }

    public saveTags(audio: AudioFile) {

    }
}
