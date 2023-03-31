import { Router } from '@angular/router';
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

    constructor(
        private ipcService: IpcService,
        private router: Router,
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
                    this.router.navigate(['home'])
                }
                else if (view === 'tageditor') {
                    this.router.navigate(['tageditor'])
                }
            })
    }
}
