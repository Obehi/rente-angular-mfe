import { LoansService } from "@services/remote-api/loans.service";
import { OffersService } from "./offers.service";
import { OfferInfo, Offers } from "./../../../shared/models/offers";
import { Component, OnInit, HostListener, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogInfoComponent } from "./dialog-info/dialog-info.component";
import { Loans } from "@shared/models/loans";
import { BANKS_DATA } from "@config/banks-config";
import { Router } from "@angular/router";
import {
  OFFER_SAVINGS_TYPE,
  AGGREGATED_RATE_TYPE,
  AGGREGATED_LOAN_TYPE
} from "../../../config/loan-state";
import { LocalStorageService } from "@services/local-storage.service";
import { ChangeBankDialogComponent } from "./change-bank-dialog/change-bank-dialog.component";
import { ChangeBankServiceService } from "@services/remote-api/change-bank-service.service";
import { Subscription } from "rxjs";
import { OFFERS_RESULT_TYPE } from "../../../shared/models/offers";
import { UserService } from "@services/remote-api/user.service";
import smoothscroll from "smoothscroll-polyfill";
import { BankUtils } from "@shared/models/bank";

@Component({
  selector: "rente-offers",
  templateUrl: "./offers.component.html",
  styleUrls: ["./offers.component.scss"]
})
export class OffersComponent implements OnInit, OnDestroy {
  public offersInfo: Offers;
  public loansInfo: any;
  public loans: Loans;
  public offerSavingsType = OFFER_SAVINGS_TYPE;
  public aggregatedRateType = AGGREGATED_RATE_TYPE;
  public aggregatedLoanType = AGGREGATED_LOAN_TYPE;
  public offersResultType = OFFERS_RESULT_TYPE;
  public isLoading = true;
  public errorMessage: string;
  public isSmallScreen: boolean;
  public isShowTips: boolean;
  public changeBankLoading: boolean;
  public subscribeShareLinkTimer: Subscription;
  public effRateLoweredDialogVisible: boolean;
  public banksMap = BANKS_DATA;
  public tips: object[];

  get hasLoansStatistics(): boolean {
    const res: boolean =
      this.offersInfo &&
      this.offersInfo.bestPercentileEffectiveRateYourBank > 0 &&
      this.offersInfo.bestPercentileEffectiveRateAllBanks > 0 &&
      this.offersInfo.medianEffectiveRateYourBank > 0 &&
      this.offersInfo.medianEffectiveRateAllBanks > 0;
    return res;
  }

  get hasStatensPensjonskasseMembership(): boolean {
    return (
      this.offersInfo &&
      this.offersInfo.memberships &&
      this.offersInfo.memberships.indexOf(
        "STATENS_PENSJONSKASSE_STATLIG_ANSATT"
      ) > -1
    );
  }

  getBankLogo(bankName: string): string {
    const b = BANKS_DATA[bankName];
    if (b && b.img) {
      return b.img;
    } else {
      const bank = BankUtils.getBankByName(bankName);
      return bank && bank.icon
        ? "../../assets/img/banks-logo/round/" + bank.icon
        : "../../assets/img/banks-logo/round/annen.png";
    }
  }

  constructor(
    public dialog: MatDialog,
    public offersService: OffersService,
    public loansService: LoansService,
    private changeBankServiceService: ChangeBankServiceService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {
    this.onResize();
    this.isShowTips = false;
    this.tips = [];
    userService.lowerRateAvailable.subscribe(value => {
      this.effRateLoweredDialogVisible = value;
    });
  }

  public ngOnDestroy(): void {
    if (this.subscribeShareLinkTimer) {
      this.subscribeShareLinkTimer.unsubscribe();
    }
  }

  public ngOnInit(): void {
    // kick off the polyfill!
    smoothscroll.polyfill();
    this.loansService.getOffers().subscribe(
      (res: Offers) => {
        this.offersInfo = res;
        this.isLoading = false;
        // const shareLinkTimer = timer(30000);
        // if (!this.localStorageService.getItem('shareSheetShown')) {
        //   this.subscribeShareLinkTimer = shareLinkTimer.subscribe(_ => {
        //     this.bottomSheet.open(ShareSheetComponent);
        //     this.localStorageService.setItem('shareSheetShown', true);
        //   });
        // }
        this.localStorageService.removeItem("isNewUser");

        this.getTips();
      },
      err => {
        if (err.errorType === "PROPERTY_VALUE_MISSING") {
          this.errorMessage = err.title;
          this.router.navigate(["/dashboard/bolig"]);
        }
        console.log(err);
      }
    );
  }

  public getTips() {
    if (
      this.offersInfo.aggregatedLoanType ===
        this.aggregatedLoanType.CREDIT_LINE ||
      this.offersInfo.aggregatedLoanType === this.aggregatedLoanType.MIX_D_C
    ) {
      this.tips.push({
        text:
          "Boligverdi/belåningsgrad er viktig mtp hva bankene tilbyr. Klikk her for å endre.",
        buttonLink: "/dashboard/bolig"
      });
    }

    if (!this.offersInfo.memberships.length) {
      this.tips.push({
        text:
          "Enkelte banker tilbyr bedre betingelser gitt at du har et medlemskap i en organisasjon. Prøv å endre ditt medlemskap for å se om det påvirker resultatet av din rentesjekk. (Medlemskap pleier å koste ca 4000 i året)",
        buttonLink: "/dashboard/profil"
      });
    }
    if (
      this.offersInfo.aggregatedRateType ===
      this.aggregatedRateType.MIX_FIXED_FLOATING
    ) {
      this.tips.push({
        text:
          "Vi ser du har ett eller flere fastrentelån. Renteradar viser besparelsespotensialet kun for lånet/lånene med flytende rente. Beste rente viser også kun beste rente for lånet/lånene med flytende rente.",
        buttonLink: "./"
      });
    }
    if (
      this.offersInfo.aggregatedLoanType ===
        this.aggregatedLoanType.CREDIT_LINE ||
      this.offersInfo.aggregatedLoanType === this.aggregatedLoanType.MIX_D_C
    ) {
      this.tips.push({
        text:
          "Du har rammelån/boligkreditt. Ønsker du å se tilbud kun for denne typen lån?",
        buttonLink: "/dashboard/profil"
      });
    }

    if (this.hasStatensPensjonskasseMembership) {
      this.tips.push({
        text:
          "Medlemmer i Statens Pensjonskasse kan finansiere opptil 2 millioner hos Statens Pensjonskasse. Klikk her for mer info om tilbudet.",
        buttonLink: "https://www.finansportalen.no/bank/boliglan/",
        external: true
      });
    }
  }

  public goToBestOffer() {
    document.getElementById("the-offers").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  public openOfferDialog(offer: OfferInfo): void {
    this.dialog.open(DialogInfoComponent, {
      data: offer
    });
  }

  public openBottomSheet() {}

  public openChangeBankDialog(offer): void {
    if (
      this.changeBankLoading ||
      this.offersInfo.offerSavingsType === this.offerSavingsType.NO_SAVINGS
    ) {
      return;
    }
    this.changeBankLoading = true;
    const offerId = offer.id;
    this.changeBankServiceService.getBankOfferRequest(offerId).subscribe(
      preview => {
        this.changeBankLoading = false;
        this.dialog.open(ChangeBankDialogComponent, {
          data: { preview, offerId }
        });
      },
      err => {
        this.changeBankLoading = false;
      }
    );
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any = null) {
    this.isSmallScreen = window.innerWidth <= 1024;
  }

  onDialogAction(answer: boolean) {
    this.effRateLoweredDialogVisible = false;
    if (answer === true) {
      this.userService.lowerRateAvailable.next(false);
      this.loansService.confirmLowerRate().subscribe(res => {});
    }
  }

  get isDialogVisble(): boolean {
    return this.effRateLoweredDialogVisible;
  }
}
