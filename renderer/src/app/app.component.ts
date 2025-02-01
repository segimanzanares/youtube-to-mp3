import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IpcService } from './services/ipc.service';
import { showAlertDialog } from './utils';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    public viewSubscription?: Subscription;
    public active: number = 0;
    public displayTagEditorTab: boolean = false;
    private aboutDisplayed: boolean = false;

    constructor(
        private ipcService: IpcService,
        private dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.listenView();
    }

    ngOnDestroy(): void {
        if (this.viewSubscription) {
            this.viewSubscription.unsubscribe();
        }
    }

    public listenView() {
        if (!this.ipcService.isElectron()) {
            return;
        }
        this.viewSubscription = this.ipcService
            .on('loadview')
            .subscribe(view => {
                if (view === 'home') {
                    this.active = 0;
                }
                else if (view === 'tageditor') {
                    this.displayTagEditorTab = true;
                    this.active = 1;
                }
                else if (view === 'about') {
                    this.showAbout();
                }
            })
    }

    private showAbout() {
        if (this.aboutDisplayed) {
            return;
        }
        this.aboutDisplayed = true;
        this.ipcService.getAppInfo()
            .then(info => {
                const message = `${info.name}\nVersión ${info.version}\nDesarrollado por ${info.author}`;
                showAlertDialog(this.dialog, {
                    data: {
                        title: "Acerca de",
                        message: message,
                        type: 'info',
                        callback: () => this.aboutDisplayed = false,
                    },
                    disableClose: true,
                    width: '380px',
                });
            })
            .catch(() => { });
    }

    public closeTagEditorTab(event: MouseEvent) {
        this.displayTagEditorTab = false;
		event.preventDefault();
		event.stopImmediatePropagation();
	}
}
