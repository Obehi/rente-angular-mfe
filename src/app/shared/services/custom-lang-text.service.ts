import { Injectable } from '@angular/core';
import { locale } from '@config/locale/locale';

@Injectable({
  providedIn: 'root'
})
export class CustomLangTextService {

  constructor() { }

  getMarkedObservationText() {
    if(locale.includes("sv")) {
      return 'Ränteradar.se övervakar kontinuerligt marknaden för att se om det erbjuds bättre räntor än den du har idag. Räntan du har på bolånet kollas och uppdateras när du identifierar dig med BankID. Det är viktigt att detta görs regelbundet för att vi ska kunna hjälpa dig med korrekt information.'
    } else if (locale.includes("nb")) {
      return 'Renteradar.no overvåker kontinuerlig markedet for bedre rente enn det du har på lånet ditt. Renten du har på lånet ditt sjekkes og oppdateres ved at du identifiserer deg med BankID. Det er viktig at dette gjøres fra tid til annen for at eventuelle renteendringer på lånet ditt skal fanges opp.'
    }
  }

  getHouseExplainationText() {
    if(locale.includes("sv") ) {
      return 'Din/Hushållets totala inkomster är en viktig parameter som bankerna kollar på'
    } else if (locale.includes("nb")) {
      return 'Din/Husstandens inntekt er en viktig parameter for renten bankene tilbyr'
    }
  }

  getLimitedLoanInfoWarning() {
    if(locale.includes("sv") ) {
      return 'Vi har endast hämtat din nominella ränta och lånebeloppet. För uträkningarna har vi utgått från en återstående löptid på 20 år. Faktisk löptid och evt. månadsavgifter förändrar förväntade besparingar.'
    } else if (locale.includes("nb")) {
      return 'Vi får kun hentet din nominelle rente og lånebeløp. For utregninger har vi tatt utgangspunkt i en gjenværende løpetid på 20 år, månedelige betalinger og 50,- i termingebyr. Faktisk løpetid og termingebyrer vil endre forventede besparelser.'
    }
  }

  getMembershipWarning() {
    if(locale.includes("sv") ) {
      return 'Vissa banker erbjuder bättre räntor om man är medlem i ett fackförbund. Lägg in ditt medlemskap för och se fler erbjudanden.'
    } else if (locale.includes("nb")) {
      return 'Enkelte banker tilbyr bedre betingelser hvis du er medlem i en interesseorganisasjon eller fagforening. Hvis du har mulighet til å melde deg inn i en kan det være penger å spare. (Medlemskap koster ca 4000 i året).'
    }
  } 

  getHouseValue() {
    if(locale.includes("sv") ) {
      return 'milj.'
    } else if (locale.includes("")) {
      return 'Bostadens värde och belåningsgrad är viktiga parametrar när banken erbjuder en ränta. Kontrollera gärna att bostadens värde är korrekt. Du kan även lägga till fler bolån om du har det.'
    }
  }

  getMillionShort() {
    if(locale.includes("sv") ) {
      return 'milj.'
    } else if (locale.includes("nb")) {
      return 'mill.'
    }
  }

  getSaveSuccessSnackBar() {
    if(locale.includes("sv") ) {
      return 'Endringene dine er lagret'
    } else if (locale.includes("nb")) {
      return 'Endringene dine er lagret'
    }
  }


  getProfileIncomePlaceHolder() {
    if(locale.includes("sv") ) {
      return 'Din årsinkomst'
    } else if (locale.includes("nb")) {
      return 'Din brutto årsinntekt'
    }
  }

  getProfileAddPlaceHolder() {
    if(locale.includes("sv") ) {
      return '+ Lägg till'
    } else if (locale.includes("nb")) {
      return '+ Legg til'
    }
  }
  
  getSnackBarClose() {
    if(locale.includes("sv") ) {
      return 'Stäng'
    } else if (locale.includes("nb")) {
      return 'Lukk'
    }
  }

  getSnackBarSavedMessage() {
    if(locale.includes("sv") ) {
      return 'Ditt meddelande är skickat'
    } else if (locale.includes("nb")) {
      return 'Din melding er sendt'
    }
  }

  getSnackBarUpdatedMessage() {
    if(locale.includes("sv") ) {
      return 'Dina ändringar är sparade'
    } else if (locale.includes("nb")) {
      return 'Endringene dine er lagret'
    }
  }
  
  getSnackBarErrorMessage() {
    if(locale.includes("sv") ) {
      return 'Oops, något gick fel'
    } else if (locale.includes("nb")) {
      return 'Oops, noe gikk galt'
    }
  }


  get18nFixForUnknown() {
    if(locale.includes("sv") ) {
      return 'Okänt'
    } else if (locale.includes("nb")) {
      return 'Ukjent'
    }
  }

  get18nFixForNo() {
    if(locale.includes("sv") ) {
      return 'Nej'
    } else if (locale.includes("nb")) {
      return 'Nei'
    }
  }

  get18nFixForRequirement() {
    if(locale.includes("sv") ) {
      return 'Krav'
    } else if (locale.includes("nb")) {
      return 'Forbehold'
    }
  }

  get18nFixForNoRequirement() {
    if(locale.includes("sv") ) {
      return 'Inget krav'
    } else if (locale.includes("nb")) {
      return 'Ingen krav'
    }
  }

  get18nFixForNoRequirement2() {
    if(locale.includes("sv") ) {
      return 'Inget forbehold'
    } else if (locale.includes("nb")) {
      return 'Ingen forbehold'
    }
  }
}
