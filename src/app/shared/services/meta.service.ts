import { Meta } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { EnvService} from '@services/env.service'
@Injectable()
export class MetaService {
    constructor(
        private meta: Meta,
        private envService: EnvService
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
        if (this.envService.get().production) {
            this.removeRobots();
        }
    }
}
