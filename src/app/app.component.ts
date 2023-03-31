import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IpcService } from './services/ipc.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    public viewSubscription?: Subscription;
    public active: number = 0;
    public displayTagEditorTab: boolean = true;

    constructor(
        private ipcService: IpcService,
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
            })
    }

    public closeTagEditorTab(event: MouseEvent) {
        this.displayTagEditorTab = false;
		event.preventDefault();
		event.stopImmediatePropagation();
	}
}
