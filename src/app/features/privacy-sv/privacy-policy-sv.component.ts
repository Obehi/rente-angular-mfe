import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';
@Component({
  selector: 'rente-privacy-policy',
  templateUrl: './privacy-policy-sv.component.html',
  styleUrls: ['./privacy-policy-sv.component.scss']
})
export class PrivacyPolicySvComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
  }
}
