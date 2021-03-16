import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';
@Component({
  selector: 'rente-privacy-policy',
  templateUrl: './privacy-policy-no.component.html',
  styleUrls: ['./privacy-policy-no.component.scss']
})
export class PrivacyPolicyNoComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
  }
}
