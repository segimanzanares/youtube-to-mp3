import { IpcService } from './../../services/ipc.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-tag-editor',
    templateUrl: './tag-editor.component.html',
    styleUrls: ['./tag-editor.component.scss']
})
export class TagEditorComponent {
    public directoryPath?: string;

    public constructor(
        private ipcService: IpcService,
    ) { }

    public openFolder() {
        this.ipcService.readAudioTagsFromFolder().then(response => {
            console.log(response)
            if (response) {
                this.directoryPath = response[0].path.substring(0, response[0].path.lastIndexOf('/'))
            }
        })
    }

}
