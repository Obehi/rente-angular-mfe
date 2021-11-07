import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'rente-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
  }
}
