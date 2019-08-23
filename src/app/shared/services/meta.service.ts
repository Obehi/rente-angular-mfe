import { Meta } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class MetaService {
    constructor(
        private meta: Meta
    ) { }

    unsetRobots(): void {
        this.meta.addTag({ name: 'robots', content: 'noindex, nofollow' });
    }

    updateMetaTags(metaName: string, metaText: string): void {
        this.meta.updateTag(
            {
                name: metaName,
                content: metaText
            }
        );
    }

    removeRobots(): void {
        this.meta.removeTag('name="robots"');
    }

    enableProdRobots(): void {
        if (environment.production) {
            this.removeRobots();
        }
    }
}
