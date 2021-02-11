import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'rente-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
  }
}
