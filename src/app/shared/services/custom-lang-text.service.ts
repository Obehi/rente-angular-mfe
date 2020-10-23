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

}