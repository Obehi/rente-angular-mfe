import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CustomLangTextService } from "@services/custom-lang-text.service";

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {

    public duration = 2;
    constructor(
        private snackBar: MatSnackBar,
        public customLangTextService: CustomLangTextService
        ) { }

    public openSuccessSnackBar(message: string, duration?: number) {
        this.snackBar.open(message, this.customLangTextService.getSnackBarClose(), {
            duration: duration ? duration * 1000 : this.duration * 1000,
            panelClass: ['bg-primary'],
            horizontalPosition: 'left'
        });
    }

    public openFailSnackBar(message: string, duration?: number) {
        this.snackBar.open(message, this.customLangTextService.getSnackBarClose(), {
            duration: duration ? duration * 1000 : this.duration * 1000,
            panelClass: ['bg-error'],
            horizontalPosition: 'left'
        });
    }
}
