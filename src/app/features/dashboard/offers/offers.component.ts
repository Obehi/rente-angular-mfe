import { LoansService } from '@services/remote-api/loans.service';
import { OffersService } from './offers.service';
import { OfferInfo, Offers } from './../../../shared/models/offers';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { Loans } from '@shared/models/loans';
import { BANKS_DATA } from '@config/banks-config';
import { LOAN_STATE_MAP } from '@config/loan-state';
import { Router } from '@angular/router';

@Component({
  selector: 'rente-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  public offersInfo: any;
  public loansInfo: any;
  public loans: Loans;
  public banksMap = BANKS_DATA;
  public loanStateMap = LOAN_STATE_MAP;
  public isLoading = true;
  public errorMessage: string;

  public offersMock = {
    bank: 'DNB',
    membership: null,
    propertyValue: 10162294,
    totalOutstandingDebt: 5788221.33,
    totalEffectiveRate: 1.977554603175785,
    offers: [
      {
        id: 0,
        bank: 'NYBYGGER',
        effectiveRate: 2.39,
        establishmentFee: 0,
        depotFee: 0,
        marketArea: 'Landsdekkende',
        maxLTV: 60,
        maxLoanPeriod: 30,
        maxInstallmentFreePeriod: 2,
        otherConditions: `Det forutsettes at terminbeløp for lån automatisk kan belastes konto, som må etableres i banken, uten melding.
        \r\n\r\n\r\nAvdragsfrihet forutsetter maks belåningsgrad 60%.`,
        productName: 'Boliglån 60%',
        requiredMembership: null,
        requiredProductPackage: null,
        savingsFirstYear: -23200.0,
        selectedRate: 2.365,
        totalSavings: -305100.0
      },
      {
        id: 1,
        bank: 'DIN_BANK',
        effectiveRate: 2.49,
        establishmentFee: 0,
        depotFee: 0,
        marketArea: 'Landsdekkende',
        maxLTV: 85,
        maxLoanPeriod: 30,
        maxInstallmentFreePeriod: 5,
        otherConditions: `Lån inntil 85 % av eiendommens markedsverdi.
          Det må stilles pant i selveiet bolig, selveierleilighet eller borettslag.
          Vi forutsetter 1. prioritets pant i bolig og tar forbehold om godkjennelse av panteobjektet.Det tas ikke pant i:
        \r\nFritidsbolig, småbruk/ landbrukseiendommer, aksje- og obligasjonsleiligheter eller utleiebolig.
        \r\nFor at lån skal kunne innvilges må låntaker ha registrerte likningstall. Realkausjon godtas ikke.
        Det tilbys kun ett DinBANK Ung-lån og låntaker må ha pant i eiendommen der hun/han selv bor.`,
        productName: 'Boliglån Ung inntil 85 %',
        requiredMembership: null,
        requiredProductPackage: null,
        savingsFirstYear: -28600.0,
        selectedRate: 2.46,
        totalSavings: -377100.0
      },
      {
        id: 2,
        bank: 'ARENDAL_SK',
        effectiveRate: 2.51,
        establishmentFee: 2500,
        depotFee: 500,
        marketArea: 'Landsdekkende',
        maxLTV: 85,
        maxLoanPeriod: 30,
        maxInstallmentFreePeriod: 0,
        otherConditions: `Er du under 34 år får du ekstra gunstige betingelser på lån til din første bolig.
          Dette forutsetter at du har nødvendig egenkapital eller tilleggssikkerhet utenom.
         Førstehjemslån innvilges når minst en av låntakerne er førstehjemskjøpere.`,
        productName: 'Førstehjemslån',
        requiredMembership: null,
        requiredProductPackage: 'Brukskonto, nettbank og kort',
        savingsFirstYear: -28700.0,
        selectedRate: 2.45,
        totalSavings: -384300.0
      },
      {
        id: 3,
        bank: 'SPAREBANK_1_LOM_OG_SKJAK',
        effectiveRate: 2.54,
        establishmentFee: 2500,
        depotFee: 0,
        marketArea: 'Landsdekkende',
        maxLTV: 85,
        maxLoanPeriod: 30,
        maxInstallmentFreePeriod: 0,
        otherConditions: 'Boliglån for Unge for deg fra 18 til og med 33. Du beholder vilkårene etter fylte 34 år inntil du endrer lånet',
        productName: 'Boliglån for unge',
        requiredMembership: null,
        requiredProductPackage: null,
        savingsFirstYear: -30700.0,
        selectedRate: 2.49,
        totalSavings: -409900.0
      },
      {
        id: 4,
        bank: 'FANA_SB',
        effectiveRate: 2.54,
        establishmentFee: 1000,
        depotFee: 1000,
        marketArea: 'Landsdekkende',
        maxLTV: 85,
        maxLoanPeriod: 30,
        maxInstallmentFreePeriod: 0,
        otherConditions: 'I enkeltstående tilfeller kan det innvilges 100% finansiering, med tilleggssikkerhet i f.eks foreldres bolig.',
        productName: 'BOLIGdebut',
        requiredMembership: null,
        requiredProductPackage: null,
        savingsFirstYear: -30800.0,
        selectedRate: 2.49,
        totalSavings: -410900.0
      }
    ],
    bestOfferEffectiveRate: 2.39,
    bestOfferTotalSaving: -305100.0,
    bestTotalSavings: -305059.5499999947,
    bestSavingsFirstYear: -23217.74636525582,
    currentLoanState: 'SAVINGS_FIRST_YEAR_BELOW_0'
  };

  constructor(
    public dialog: MatDialog,
    public offersService: OffersService,
    public loansService: LoansService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    // this.offersInfo = this.offersMock;

    this.loansService.getOffers().subscribe((res: Offers) => {
      console.log('offers', res);
      this.offersInfo = res;
      this.isLoading = false;
    }, err => {
      if (err.errorType === 'PROPERTY_VALUE_MISSING') {
        this.errorMessage = err.title;
        this.router.navigate(['/property-missing']);
      }
      console.log(err);
    });
  }

  public openOfferDialog(offer: OfferInfo): void {
    this.dialog.open(DialogInfoComponent, {
      width: '600px',
      data: offer
    });
  }

}
