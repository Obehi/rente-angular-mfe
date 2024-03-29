import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';
import { EnvService } from '@services/env.service';

@Component({
  selector: 'rente-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  constructor(private seoService: SeoService, private envService: EnvService) {}
  privacyPolicyLink: string;
  ngOnInit(): void {
    if (this.envService.isNorway()) {
      this.privacyPolicyLink = 'personvernerklaering';
    }
    if (this.envService.isSweden()) {
      this.privacyPolicyLink = 'integritypolicy';
    }
    this.seoService.createLinkForCanonicalURL();
  }
}
