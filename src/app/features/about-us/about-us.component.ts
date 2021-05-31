import { Component, OnInit, Input } from '@angular/core';
import { CustomLangTextService } from '@services/custom-lang-text.service';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'rente-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  @Input() isFrontPage: boolean;

  constructor(
    private seoService: SeoService,
    public langService: CustomLangTextService
  ) {}

  ngOnInit(): void {
    this.langService.getRenteradarUrl();
    this.seoService.createLinkForCanonicalURL();
  }
}
