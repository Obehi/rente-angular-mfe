import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';
@Component({
  selector: 'rente-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
  }
}
