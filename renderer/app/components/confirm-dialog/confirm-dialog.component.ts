import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogOptions {
    title?: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    onCancel?(): void;
    callback?(value?: any): void;
}

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogOptions
    ) { }

    onNoClick(): void {
        if (this.data['onCancel']) {
            this.data['onCancel']();
        }
        this.dialogRef.close();
    }

}
