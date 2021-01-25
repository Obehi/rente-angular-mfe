import { Injectable } from '@angular/core';

import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleService {
  constructor(private title: Title) {}

  setTitle(titleToPush: string): void {
    this.title.setTitle(titleToPush);
  }
}
