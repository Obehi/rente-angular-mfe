import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {

    public duration = 2;
    constructor(private snackBar: MatSnackBar) { }

    public openSuccessSnackBar(message: string, duration?: number) {
        this.snackBar.open(message, 'Lukk', {
            duration: duration ? duration * 1000 : this.duration * 1000,
            panelClass: ['bg-primary'],
            horizontalPosition: 'left'
        });
    }

    public openFailSnackBar(message: string) {
        this.snackBar.open(message, 'Lukk', {
            duration: 2 * 1000,
            panelClass: ['bg-error'],
            horizontalPosition: 'left'
        });
    }
}
