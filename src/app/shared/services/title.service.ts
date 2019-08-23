import { Injectable } from '@angular/core';

// TODO: Experimental service
// https://angular.io/docs/js/latest/api/platform-browser/index/Title-class.html
import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleService {
    constructor(
        private title: Title
    ) { }

    setTitle(titleToPush: string): void {
        this.title.setTitle(titleToPush);
    }
}
