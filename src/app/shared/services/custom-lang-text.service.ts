import { Injectable } from '@angular/core';
import { locale } from '@config/locale/locale';

@Injectable({
  providedIn: 'root'
})
export class CustomLangTextService {
  getRenteradarLinkText(): string {
    if (locale.includes('sv')) {
      return 'Ranteradar.se';
    } else if (locale.includes('nb')) {
      return 'Renteradar.no';
    }
    throw new Error('Should be either SV or NB');
  }
  getRenteradarUrl(): string {
    if (locale.includes('sv')) {
      return 'https://ranteradar.se';
    } else if (locale.includes('nb')) {
      return 'https://ranteradar.no/';
    }
    throw new Error('Should be either SV or NB');
  }

  getOffeCardCTAButtonText(): string {
    if (locale.includes('sv')) {
      return 'Få erbjudande från banken';
    } else if (locale.includes('nb')) {
      return 'Få tilbud fra banken!';
    }
    throw new Error('Should be either SV or NB');
  }
  getEmail(): string {
    if (locale.includes('sv')) {
      return 'hej@ranteradar.se';
    } else if (locale.includes('nb')) {
      return 'hei@renteradar.no';
    }
    throw new Error('Should be either SV or NB');
  }

  getMarkedObservationText(): string {
    if (locale.includes('sv')) {
      return 'Ränteradar.se övervakar kontinuerligt marknaden för att se om det erbjuds bättre räntor än den du har idag. Räntan du har på bolånet kollas och uppdateras när du identifierar dig med BankID. Det är viktigt att detta görs regelbundet för att vi ska kunna hjälpa dig med korrekt information.';
    } else if (locale.includes('nb')) {
      return 'Renteradar.no overvåker kontinuerlig markedet for bedre rente enn det du har på lånet ditt. Renten du har på lånet ditt sjekkes og oppdateres ved at du identifiserer deg med BankID. Det er viktig at dette gjøres fra tid til annen for at eventuelle renteendringer på lånet ditt skal fanges opp.';
    }
    throw new Error('Should include either SV or NB');
  }

  getHasFixedRateLoanTipsHeader(): string {
    if (locale.includes('sv')) {
      return 'Fast bolåneränta';
    } else if (locale.includes('nb')) {
      return 'Fastrentelån';
    }
    throw new Error('Should include either SV or NB');
  }

  getHasFixedRateLoan(): string {
    if (locale.includes('sv')) {
      return 'Vi ser att du även har fasta bolåneräntor. Ränteradar  jämför endast din rörliga ränta mot marknadens bästa erbjudanden.';
    } else if (locale.includes('nb')) {
      return 'Vi ser du har ett eller flere fastrentelån. Renteradar viser besparelsespotensialet kun for lånet/lånene med flytende rente. Beste rente viser også kun beste rente for lånet/lånene med flytende rente.';
    }
    throw new Error('Should include either SV or NB');
  }

  getHouseExplainationText(): string {
    if (locale.includes('sv')) {
      return 'Din/Hushållets totala inkomster är en viktig parameter som bankerna kollar på';
    } else if (locale.includes('nb')) {
      return 'Din/Husstandens inntekt er en viktig parameter for renten bankene tilbyr';
    }
    throw new Error('Should include either SV or NB');
  }

  getLimitedLoanInfoWarning(): string {
    if (locale.includes('sv')) {
      return 'Vi har endast hämtat din nominella ränta och lånebeloppet. För uträkningarna har vi utgått från en återstående löptid på 20 år. Faktisk löptid och evt. månadsavgifter förändrar förväntade besparingar.';
    } else if (locale.includes('nb')) {
      return 'Vi får kun hentet din nominelle rente og lånebeløp. For utregninger har vi tatt utgangspunkt i en gjenværende løpetid på 20 år, månedelige betalinger og 50,- i termingebyr. Faktisk løpetid og termingebyrer vil endre forventede besparelser.';
    }
    throw new Error('Should include either SV or NB');
  }

  getMembershipWarning(): string {
    if (locale.includes('sv')) {
      return 'Vissa banker erbjuder bättre räntor om man är medlem i ett fackförbund. Lägg in ditt medlemskap för och se fler erbjudanden.';
    } else if (locale.includes('nb')) {
      return 'Enkelte banker tilbyr bedre betingelser hvis du er medlem i en interesseorganisasjon eller fagforening. Hvis du har mulighet til å melde deg inn i en kan det være penger å spare. (Medlemskap koster ca 4000 i året).';
    }
    throw new Error('Should include either SV or NB');
  }

  getMembershipSearchText(): string {
    if (locale.includes('sv')) {
      return 'Sök fackförbund';
    } else if (locale.includes('nb')) {
      return 'Søk medlemskap';
    }
    throw new Error('Should include either SV or NB');
  }

  getHouseValue(): string {
    if (locale.includes('sv')) {
      return 'Bostadens värde och belåningsgrad är viktiga parametrar när banken erbjuder en ränta. Kontrollera gärna att bostadens värde är korrekt. Du kan även lägga till fler bolån om du har det.';
    } else if (locale.includes('')) {
      return 'Boligverdi/belåningsgrad er viktig for renten bankene tilbyr. Pass på at boligverdien din er riktig. Du kan også legge til flere boliger hvis du har det.';
    }
    throw new Error('Should include either SV or NB');
  }

  getMillionShort(): string {
    if (locale.includes('sv')) {
      return 'milj.';
    } else if (locale.includes('nb')) {
      return 'mill.';
    }
    throw new Error('Should include either SV or NB');
  }

  getSaveSuccessSnackBar(): string {
    if (locale.includes('sv')) {
      return 'Endringene dine er lagret';
    } else if (locale.includes('nb')) {
      return 'Endringene dine er lagret';
    }
    throw new Error('Should include either SV or NB');
  }

  getProfileIncomePlaceHolder(): string {
    if (locale.includes('sv')) {
      return 'Din årsinkomst';
    } else if (locale.includes('nb')) {
      return 'Din brutto årsinntekt';
    }
    throw new Error('Should include either SV or NB');
  }

  getProfileAddPlaceHolder(): string {
    if (locale.includes('sv')) {
      return '+ Lägg till';
    } else if (locale.includes('nb')) {
      return '+ Legg til';
    }
    throw new Error('Should include either SV or NB');
  }

  getSnackBarClose(): string {
    if (locale.includes('sv')) {
      return 'Stäng';
    } else if (locale.includes('nb')) {
      return 'Lukk';
    }
    throw new Error('Should include either SV or NB');
  }

  getSnackBarSavedMessage(): string {
    if (locale.includes('sv')) {
      return 'Ditt meddelande är skickat';
    } else if (locale.includes('nb')) {
      return 'Din melding er sendt';
    }
    throw new Error('Should include either SV or NB');
  }

  getSnackBarUpdatedMessage(): string {
    if (locale.includes('sv')) {
      return 'Dina ändringar är sparade';
    } else if (locale.includes('nb')) {
      return 'Endringene dine er lagret';
    }
    throw new Error('Should include either SV or NB');
  }

  getSnackBarErrorMessage(): string {
    if (locale.includes('sv')) {
      return 'Oops, något gick fel';
    } else if (locale.includes('nb')) {
      return 'Oops, noe gikk galt';
    }
    throw new Error('Should include either SV or NB');
  }

  get18nFixForUnknown(): string {
    if (locale.includes('sv')) {
      return 'Okänt';
    } else if (locale.includes('nb')) {
      return 'Ukjent';
    }
    throw new Error('Should include either SV or NB');
  }

  get18nFixForNo(): string {
    if (locale.includes('sv')) {
      return 'Nej';
    } else if (locale.includes('nb')) {
      return 'Nei';
    }
    throw new Error('Should include either SV or NB');
  }

  get18nFixForRequirement(): string {
    if (locale.includes('sv')) {
      return 'Övriga krav';
    } else if (locale.includes('nb')) {
      return 'Forbehold';
    }
    throw new Error('Should include either SV or NB');
  }

  get18nFixForNoRequirement(): string {
    if (locale.includes('sv')) {
      return 'Inga merkrav';
    } else if (locale.includes('nb')) {
      return 'Ingen krav';
    }
    throw new Error('Should include either SV or NB');
  }

  get18nFixForNoRequirement2(): string {
    if (locale.includes('sv')) {
      return 'Inga övriga krav';
    } else if (locale.includes('nb')) {
      return 'Ingen forbehold';
    }
    throw new Error('Should include either SV or NB');
  }

  getName(): string {
    if (locale.includes('sv')) {
      return 'Namn';
    } else if (locale.includes('nb')) {
      return 'Navn';
    }
    throw new Error('Should include either SV or NB');
  }

  getlowerRateTitle(): string {
    if (locale.includes('sv')) {
      return 'Grattis, du har en lägre ränta än förra gången! ';
    } else if (locale.includes('nb')) {
      return 'Du har lavere rente enn forrige gang!';
    }
    throw new Error('Should include either SV or NB');
  }

  getlowerRateBody(): string {
    if (locale.includes('sv')) {
      return 'Var vi till hjälp för att sänka din bolåneränta?';
    } else if (locale.includes('nb')) {
      return 'Fikk du lavere rente etter å ha sendt melding fra Renteradar.no?';
    }
    throw new Error('Should include either SV or NB');
  }

  getProfileMarketOption1(): string {
    if (locale.includes('sv')) {
      return 'Varje månad';
    } else if (locale.includes('nb')) {
      return 'Hver måned';
    }
    throw new Error('Should include either SV or NB');
  }

  getProfileMarketOption2(): string {
    if (locale.includes('sv')) {
      return 'Var 2. månad';
    } else if (locale.includes('nb')) {
      return 'Hver 2. måned';
    }
    throw new Error('Should include either SV or NB');
  }

  getProfileMarketOption3(): string {
    if (locale.includes('sv')) {
      return 'Var 3. månad';
    } else if (locale.includes('nb')) {
      return 'Hver 3. måned';
    }
    throw new Error('Should include either SV or NB');
  }

  getProfileMarketOption4(): string {
    if (locale.includes('sv')) {
      return 'Var 4. månad';
    } else if (locale.includes('nb')) {
      return 'Hver 4. måned';
    }
    throw new Error('Should include either SV or NB');
  }

  getProfileMarketOption5(): string {
    if (locale.includes('sv')) {
      return 'Aldrig';
    } else if (locale.includes('nb')) {
      return 'Aldri';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerTextState0(): string {
    if (locale.includes('sv')) {
      return 'Din ränta är mycket dåligare än genomsnittet';
    } else if (locale.includes('nb')) {
      return 'Renten din er mye dårligere enn gjennomsnittet';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerTextState1(): string {
    if (locale.includes('sv')) {
      return 'Din ränta är dåligare än genomsnittet';
    } else if (locale.includes('nb')) {
      return 'Renten din er dårligere enn gjennomsnittet';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerTextState2(): string {
    if (locale.includes('sv')) {
      return 'Din ränta är genomsnittlig';
    } else if (locale.includes('nb')) {
      return 'Renten din er gjennomsnittlig';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerTextState3(): string {
    if (locale.includes('sv')) {
      return 'Din ränta är bra';
    } else if (locale.includes('nb')) {
      return 'Renten din er god';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerTextState4(): string {
    if (locale.includes('sv')) {
      return 'Din ränta är mycket bra';
    } else if (locale.includes('nb')) {
      return 'Renten din er svært god';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerAdditionalTextLowSavingsState0(): string {
    if (locale.includes('sv')) {
      return 'och du kan spara lite';
    } else if (locale.includes('nb')) {
      return 'og du kan spare litt';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerAdditionalTextLowSavingsState1(): string {
    if (locale.includes('sv')) {
      return 'men du kan spara en del';
    } else if (locale.includes('nb')) {
      return 'og du kan spare en del';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerAdditionalTextLowSavingsState2(): string {
    if (locale.includes('sv')) {
      return 'och du kan spara mycket';
    } else if (locale.includes('nb')) {
      return 'og du kan spare en del';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerAdditionalTextLowSavingsState3(): string {
    if (locale.includes('sv')) {
      return 'och du kan spara mycket';
    } else if (locale.includes('nb')) {
      return 'og du kan spare mye';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerAdditionalTextHighSavingsState0(): string {
    if (locale.includes('sv')) {
      return 'men du kan spara lite';
    } else if (locale.includes('nb')) {
      return 'men du kan spare litt';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerAdditionalTextHighSavingsState1(): string {
    if (locale.includes('sv')) {
      return 'men du kan spara en del';
    } else if (locale.includes('nb')) {
      return 'men du kan spare en del';
    }
    throw new Error('Should include either SV or NB');
  }

  getBarometerAdditionalTextHighSavingsState2(): string {
    if (locale.includes('sv')) {
      return 'men du kan spara mycket';
    } else if (locale.includes('nb')) {
      return 'men du kan spare en del';
    }
    throw new Error('Should include either SV or NB');
  }

  logout(): string {
    if (locale.includes('sv')) {
      return 'Du är nu utloggad';
    } else if (locale.includes('nb')) {
      return 'Du er nå logget ut';
    }
    throw new Error('Should be either SV or NB');
  }
  getBarometerAdditionalTextHighSavingsState3(): string {
    if (locale.includes('sv')) {
      return 'men du kan spara mycket';
    } else if (locale.includes('nb')) {
      return 'men du kan allikevel spare mye';
    }
    throw new Error('Should include either SV or NB');
  }

  getChooseText(): string {
    if (locale.includes('sv')) {
      return 'Välj';
    } else if (locale.includes('nb')) {
      return 'Velg';
    }
    throw new Error('Should include either SV or NB');
  }

  getChoosenText(): string {
    if (locale.includes('sv')) {
      return 'valda';
    } else if (locale.includes('nb')) {
      return 'valgt';
    }
    throw new Error('Should include either SV or NB');
  }

  // getBarometerAdditionalTextLowSavingsState4(): string {
  //   if (locale.includes('sv')) {
  //     return 'men du kan spara en del';
  //   } else if (locale.includes('nb')) {
  //     return 'men du kan spare en del';
  //   }
  //   throw new Error('Should include either SV or NB');
  // }
}
