import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface AlertDialogOptions {
    title?: string;
    message: string;
    acceptButtonText?: string;
    showAcceptButton?: boolean;
    type?: 'loading' | 'success' | 'info';
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

    onNoClick(): void {
        this.dialogRef.close();
    }
}
