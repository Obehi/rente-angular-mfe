import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {

    constructor(private snackBar: MatSnackBar) { }

    public openSuccessSnackBar(message: string) {
        this.snackBar.open(message, 'Lukk', {
            duration: 2 * 1000,
            panelClass: ['bg-primary'],
            horizontalPosition: 'right'
        });
    }

    public openFailSnackBar(message: string) {
        this.snackBar.open(message, 'Lukk', {
            duration: 2 * 1000,
            panelClass: ['bg-error'],
            horizontalPosition: 'right'
        });
    }
}
