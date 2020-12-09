import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { LocalStorageService } from "@services/local-storage.service";
import { OptimizeService } from '@services/optimize.service'
import { ROUTES_MAP } from '@config/routes-config';

@Component({
  selector: "rente-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

  public optimize: OptimizeService;
  public routesMap = ROUTES_MAP;

  constructor(
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private localStorageService: LocalStorageService
  ) { }

  public navLinks = ["tilbud", "mine-lan", "bolig", "preferanser", "profil"];
  public activeLinkIndex = -1;
  public isMobile: boolean;
  public imgLink = {
    tilbud: "../../../assets/icons/ic_offer.svg",
    "mine-lan": "../../../assets/icons/ic_loan.svg",
    bolig: "../../../assets/icons/ic_house.svg",
    preferanser: "../../../assets/icons/ic_preferanses.svg",
    profil: "../../../assets/icons/ic_profile.svg"
  };

  private subscription: any;

  onActivate(event: any) {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    if (this.localStorageService.getItem("noLoansPresent")) {
      this.router.navigate(["/dashboard/" + ROUTES_MAP.noLoan]);
    } else if (this.localStorageService.getItem("isAggregatedRateTypeFixed")) {
      this.router.navigate(["/dashboard/fastrente"]);
    } else {
      this.activeLinkIndex = this.getActiveIndex();
      this.setActiveIcon(this.activeLinkIndex);
      this.subscription = this.router.events.subscribe(res => {
        this.activeLinkIndex = this.getActiveIndex();
        this.setActiveIcon(this.activeLinkIndex);
      });
      this.checkmobileVersion();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getActiveIndex(): number {
    return this.navLinks.indexOf(
      this.navLinks.find(
        link => `/dashboard/${link}` === this.router.url.split("?")[0]
      )
    );
  }

  private setActiveIcon(activeIndex: number) {
    this.navLinks.forEach((link: string, index: number) => {
      if (index === activeIndex) {
        if (!this.imgLink[link].includes("active")) {
          this.imgLink[link] = this.imgLink[link].replace(
            ".svg",
            "_active.svg"
          );
        }
      } else {
        this.imgLink[link] = this.imgLink[link].replace("_active.svg", ".svg");
      }
    });
  }



  private checkmobileVersion() {
    this.breakpointObserver
      .observe(["(min-width: 992px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobile = false;
        } else {
          this.isMobile = true;
        }
      });
  }
}
