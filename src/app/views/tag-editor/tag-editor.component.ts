import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AudioFile, IAudioFile } from './../../models/audiofile';
import { IpcService } from './../../services/ipc.service';
import { showAlertDialog } from './../../utils';

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

    /*test*/private audios: IAudioFile[] = [{"path":"/home/segi/Música/Akwid feat. Jose Jose - Contigo.mp3","name":"Akwid feat. Jose Jose - Contigo.mp3","tags":{"title":"Contigo","artist":"Akwid/jose Jose"}},{"path":"/home/segi/Música/Bebe dame.mp3","name":"Bebe dame.mp3","tags":{}},{"path":"/home/segi/Música/Belanova - Nada de mas (Dj Erax Extended Club Mix).mp3","name":"Belanova - Nada de mas (Dj Erax Extended Club Mix).mp3","tags":{"title":"Nada De Mas (Dj Erax Extended Club Mix)","artist":"Belanova"}},{"path":"/home/segi/Música/Camila - Perderte de nuevo (Dj Karlos Cuevas Radio Edith).mp3","name":"Camila - Perderte de nuevo (Dj Karlos Cuevas Radio Edith).mp3","tags":{"title":"Perderte De Nuevo (Dj Karlos Cuevas Radio Edith","artist":"Camila"}},{"path":"/home/segi/Música/César Vilo feat. Less Lee - Dime porque (Karlos Cuevas Electrik Mix).mp3","name":"César Vilo feat. Less Lee - Dime porque (Karlos Cuevas Electrik Mix).mp3","tags":{"title":"Dime Porque (Karlos Cuevas Electrik Mix)","artist":"César Vilo Feat. Less Lee"}},{"path":"/home/segi/Música/DJ Kuri - Al ritmo de la marimba.mp3","name":"DJ Kuri - Al ritmo de la marimba.mp3","tags":{"title":"Al Ritmo De La Marimba","artist":"Dj Kuri"}},{"path":"/home/segi/Música/Dame un beso y dime adios.mp3","name":"Dame un beso y dime adios.mp3","tags":{}},{"path":"/home/segi/Música/Don Abusivo feat. Luna - Tu y yo.mp3","name":"Don Abusivo feat. Luna - Tu y yo.mp3","tags":{"title":"Tú Y Yo","artist":"Don Abusivo/luna"}},{"path":"/home/segi/Música/Guardianes Del Amor - Olvidarte Nunca.mp3","name":"Guardianes Del Amor - Olvidarte Nunca.mp3","tags":{"title":"Olvidarte Nunca","artist":"Guardianes Del Amor"}},{"path":"/home/segi/Música/Los Tetas feat. Germain De La Fuente - Como quisiera decirte.mp3","name":"Los Tetas feat. Germain De La Fuente - Como quisiera decirte.mp3","tags":{"title":"Como Quisiera Decirte","artist":"Los Tetas/germain De La Fuente"}},{"path":"/home/segi/Música/Pitbull - Give me everything (Segimanz Gimme Club Mix).mp3","name":"Pitbull - Give me everything (Segimanz Gimme Club Mix).mp3","tags":{"title":"Give Me Everything (Segimanz Gimme Club Mix)"}},{"path":"/home/segi/Música/Prince Royce - Incondicional (Dj Karlos Cuevas Radio Mix).mp3","name":"Prince Royce - Incondicional (Dj Karlos Cuevas Radio Mix).mp3","tags":{"title":"Incondicional (Dj Karlos Cuevas Radio Mix)","artist":"Prince Royce"}},{"path":"/home/segi/Música/Que viva la fiesta.mp3","name":"Que viva la fiesta.mp3","tags":{"title":"Que Viva La Fiesta","artist":"Dj Kury"}},{"path":"/home/segi/Música/Que vuelvas.mp3","name":"Que vuelvas.mp3","tags":{}},{"path":"/home/segi/Música/Reik - Te fuiste de aqui (Dj Checoo & Segi Manzanares Rouge Mix).mp3","name":"Reik - Te fuiste de aqui (Dj Checoo & Segi Manzanares Rouge Mix).mp3","tags":{"title":"Te Fuiste De Aqui (Dj Checoo & Segi Manzanares Rouge Mix)","artist":"Reik"}},{"path":"/home/segi/Música/The Mills - Lobo hombre en paris (DJ Erax Club Mix).mp3","name":"The Mills - Lobo hombre en paris (DJ Erax Club Mix).mp3","tags":{"title":"Lobo Hombre En Paris (Dj Erax Club Mix)","artist":"The Mills"}},{"path":"/home/segi/Música/Usher - Dj got us falling in love (Dj Sk-Moon Club Mix).mp3","name":"Usher - Dj got us falling in love (Dj Sk-Moon Club Mix).mp3","tags":{"title":"Dj Got Us Falling In Love (Dj","artist":"Usher Feat. Pitbull"}}];

    public constructor(
        private ipcService: IpcService,
        public dialog: MatDialog,
    ) {
        this.dataSource = new MatTableDataSource<AudioFile>([]);
        this.dataSource.data = this.audios.map(a => AudioFile.fromJson(a)) //test
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

    }

    public saveTags(audio: AudioFile) {

    }

    public extractFromFilename() {
        const ref = showAlertDialog(this.dialog, {
            data: {
                message: "Analizando...",
                showAcceptButton: false,
                type: 'loading',
            },
            disableClose: true,
        });
        this.ipcService.readAudioTagsFromFilename(this.dataSource.data)
            .then(response => {
                this.saveEnabled = true;
                this.dataSource.data = response;
            })
            .finally(() => ref.close());
    }

    public saveAll() {

    }
}
