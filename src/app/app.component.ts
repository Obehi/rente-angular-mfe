import { Component, OnInit, Inject } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { MetaService } from "@shared/services/meta.service";
import { TitleService } from "@services/title.service";

@Component({
  selector: "rente-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  public title = "rente-front-end";
  public navigationSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private titleService: TitleService
  ) {}

  onActivate(event: any) {
    window.scrollTo(0, 0);
  }
  ngOnInit() {
    this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.changeTitles();
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: "virtualPageView",
            url: window.location.href
          });
        }
      }
    });
  }

  private changeTitles(): void {
    let data = this.route.root.firstChild.snapshot.data;
    if (!data.title) {
      data = this.route.root.firstChild.firstChild.firstChild.snapshot.data;
    }
    const title = data.title;
    const metaData = data.meta;

    this.titleService.setTitle(title);
    if (metaData) {
      this.metaService.updateMetaTags(metaData.name, metaData.description);
    }
  }
}
