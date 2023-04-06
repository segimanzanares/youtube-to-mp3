import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { nl2br } from './../../utils';

export type AlertDialogType = 'loading' | 'success' | 'info';

export interface AlertDialogOptions {
    title?: string;
    message: string;
    acceptButtonText?: string;
    showAcceptButton?: boolean;
    type?: AlertDialogType;
    callback?(): void;
}

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<AlertDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AlertDialogOptions
    ) { }

    public get message(): string {
        return nl2br(this.data.message);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
