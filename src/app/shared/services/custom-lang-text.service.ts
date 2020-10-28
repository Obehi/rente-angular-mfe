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
      return 'Bankerna ger ibland bättre erbjudanden om du är medlem i ett fackförbund'
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

  
}
