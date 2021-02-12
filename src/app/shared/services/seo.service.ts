import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(@Inject(DOCUMENT) private doc) {}

  createLinkForCanonicalURL() {
    const links = Array.from(this.doc.head.getElementsByTagName('link'));

    // remove previous canonical link elements
    links
      .filter((link) => {
        const element = link as HTMLElement;
        return element.getAttribute('rel') === 'canonical';
      })
      .forEach((link) => {
        const toBeRemoved = link as HTMLElement;
        toBeRemoved.remove();
      });

    // Add coanonical link
    const link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.doc.head.appendChild(link);
    link.setAttribute('href', this.doc.URL);
  }
}
