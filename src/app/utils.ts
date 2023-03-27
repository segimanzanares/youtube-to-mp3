import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { AlertDialogComponent, AlertDialogOptions } from './components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogOptions } from './components/confirm-dialog/confirm-dialog.component';

export const showAlertDialog = (dialog: MatDialog, config: MatDialogConfig<AlertDialogOptions>): MatDialogRef<AlertDialogComponent> => {
    const dialogRef = dialog.open(AlertDialogComponent, {
        data: {
            title: config.data?.title ?? null,
            message: config.data?.message,
            acceptButtonText: config.data?.acceptButtonText ?? "OK",
            showAcceptButton: config.data?.showAcceptButton != null ? config.data.showAcceptButton : true,
            type: config.data?.type ?? null
        },
        width: config.width ? config.width : '350px',
        disableClose: config.disableClose != null ? config.disableClose : false
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result === 'OK' && config.data?.callback) {
            config.data.callback();
        }
    });
    return dialogRef;
};

export const showConfirmDialog = (dialog: MatDialog, config: MatDialogConfig<ConfirmDialogOptions>) => {
    const dialogRef = dialog.open(ConfirmDialogComponent, {
        data: {
            title: config.data?.title ?? null,
            message: config.data?.message,
            confirmButtonText: config.data?.confirmButtonText ?? "Yes, do it",
            cancelButtonText: config.data?.cancelButtonText ?? "Cancel",
            onCancel: config.data?.onCancel ?? void 0,
        },
        width: config.width ? config.width : '350px',
        disableClose: config.disableClose != null ? config.disableClose : false
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result === 'OK' && config.data?.callback) {
            config.data.callback();
        }
    });
};