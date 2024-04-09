import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirmation.component';

@Injectable({
    providedIn: 'root'
})
export class ConfirmationService {
    constructor(private _dialog: MatDialog) { }

    public confirm(model?: { title?: string, content?: string, item?: string, imageUrl?: string, okBtnText?: string, dismissBtnText?: string }): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const ref = this._dialog.open(ConfirmationComponent, { disableClose: true });
            ref.componentInstance.model = model!;

            const sub = ref.componentInstance.confirm.subscribe((decision: boolean) => {
                sub.unsubscribe();
                ref.close();
                resolve(decision);
            });
        });
    }
}