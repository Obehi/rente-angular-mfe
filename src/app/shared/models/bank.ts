export class BankVo {
  constructor(
    public name:string,
    public label:string,
    public icon:string,
    public logo:string = null,
    public loginWithSsn:boolean = false,
    public isEikaBank:boolean = false,
    public mobileUrl:string = null
  ) { }
}

export const BankList:BankVo[] = [
  new BankVo('DNB', 'DNB Bank ASA', 'dnb.png', 'dnb-color.svg', true, false, 'https://m.dnb.no/kundeservice/privat/bankidmobil.html'),
  new BankVo('NORDEA', 'NORDEA BANK ABP, FILIAL I NORGE', 'nordea.png', 'nordea-color.svg', false, false, 'https://www.nordea.no/privat/kundeservice/slik-gjor-du/slik-kommer-du-i-gang-med-bankid-pa-mobil.html'),
  // Sparebank 1
  new BankVo('SPAREBANK_1_BV', 'SpareBank 1 BV', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_GUDBRANDSDAL', 'SpareBank 1 Gudbrandsdal', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_HALLINGDAL_VALDRES', 'SpareBank 1 Hallingdal Valdres', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_LOM_OG_SKJAK', 'SpareBank 1 Lom og Skjåk', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_MODUM', 'SpareBank 1 Modum', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_NORD_NORGE', 'SpareBank 1 Nord-Norge', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_NORDVEST', 'SpareBank 1 Nordvest', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_RINGERIKE_HADELAND', 'SpareBank 1 Ringerike Hadeland', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_SMN', 'SpareBank 1 SMN', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_SR_BANK', 'SpareBank 1 SR-Bank', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_SORE_SUNNMORE', 'SpareBank 1 Søre Sunnmøre', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_TELEMARK', 'SpareBank 1 Telemark', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_OSTFOLD_AKERSHUS', 'SpareBank 1 Østfold Akershus', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  new BankVo('SPAREBANK_1_OSTLANDET', 'SpareBank 1 Østlandet', 'sparebanken1v2.png', 'sparebank1-color.svg', false, false, 'https://www.sparebank1.no/nb/bank/privat/kundeservice/mobil/hvordan-bestiller-jeg-bankid-pa-mobil.html'),
  // EIKA banks
  new BankVo('AASEN_SB', 'Aasen Sparebank', 'aasen.png', null, true, true, 'https://aasen-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('ANDEBU_SB', 'Andebu Sparebank', 'andebu.png', null, true, true, 'https://andebu-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('ARENDAL_SK', 'Arendal og Omegns Sparekasse', 'sparekassa_arendal.png', null, true, true, 'https://sparekassa.no/aktuelt/bankid-paa-mobil'),
  new BankVo('ARENDAL_SK', 'Sparekassa', 'sparekassa_arendal.png', null, true, true, 'https://sparekassa.no/aktuelt/bankid-paa-mobil'),
  new BankVo('ASKIM_SB', 'Askim og Spydeberg Sparebank', 'askim.png', null, true, true, 'https://asbank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('AURSKOG_SB', 'Aurskog Sparebank', 'aurskog.png', null, true, true, 'https://aurskog-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('BANK2', 'Bank2 ASA', 'bank2.png', null, true, true, 'https://bank2.no/aktuelt/bankid-paa-mobil'),
  new BankVo('BERG_SB', 'Berg Sparebank', 'berg.png', null, true, true, 'https://berg-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('BIEN', 'Bien Sparebank ASA', 'bien.png', null, true, true, 'https://bien.no/aktuelt/bankid-paa-mobil'),
  new BankVo('BIRKENES_SB', 'Birkenes Sparebank', 'birkenes.png', null, true, true, 'https://birkenes-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('BJUGN_SB', 'Bjugn Sparebank', 'bjugn.png', null, true, true, 'https://bjugn-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('BLAKER_SB', 'Blaker Sparebank', 'blaker.png', null, true, true, 'https://blakersparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('DRANGEDAL_SB', 'Drangedal Sparebank', 'drangedal.png', null, true, true, 'https://drangedalsparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('EIDSBERG_SB', 'Eidsberg Sparebank', 'eidsberg.png', null, true, true, 'https://esbank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('ETNEDAL_SB', 'Etnedal Sparebank', 'etnedal.png', null, true, true, 'https://etnedalsparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('EVJE_SB', 'Evje og Hornnes Sparebank', 'evje_hornnes.png', null, true, true, 'https://eh-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('FORNEBU_SB', 'Fornebu Sparebank', 'fornebu.png', null, true, true, 'https://fornebusparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('GILDESKAL_SB', 'Gildeskål Sparebank', 'gildeskal.png', null, true, true, 'https://gildeskaal-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('GRONG_SB', 'Grong Sparebank', 'grong.png', null, true, true, 'https://grong-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('GRUE_SB', 'Grue Sparebank', 'grue.png', null, true, true, 'https://gruesparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('HALTDALEN_SB', 'Haltdalen Sparebank', 'haltdalen.png', null, true, true, 'https://haltdalensparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('HEGRA_SB', 'Hegra Sparebank', 'hegra.png', null, true, true, 'https://hegrasparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('HEMNE_SB', 'Hemne Sparebank', 'hemne.png', null, true, true, 'https://hemnesparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('HJARTDAL_SB', 'Hjartdal og Gransherad Sparebank', 'hjartdal.png', null, true, true, 'https://hjartdalbanken.no/aktuelt/bankid-paa-mobil'),
  new BankVo('HJELMELAND_SB', 'Hjelmeland Sparebank', 'hjelmeland.png', null, true, true, 'https://hjelmeland-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('HOLAND_SB', 'Høland og Setskog Sparebank', 'holand_setskog.png', null, true, true, 'https://hsbank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('HONEFOSS_SB', 'Hønefoss Sparebank', 'honefoss.png', null, true, true, 'https://honefossbank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('JERNBANEPERSONALETS', 'Jernbanepersonalets Bank og Forsikring', 'jernbane.png', null, true, true, 'https://jbf.no/aktuelt/bankid-paa-mobil'),
  new BankVo('JAEREN_SB', 'Jæren Sparebank', 'jaeren.png', null, true, true, 'https://jaerensparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('KVINESDAL_SB', 'Kvinesdal Sparebank', 'kvinesdal.png', null, true, true, 'https://kvinesdalsparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('LARVIKBANKEN', 'Larvikbanken', 'larvikbanken.png', null, true, true, 'https://larvikbanken.no/aktuelt/bankid-paa-mobil'),
  new BankVo('LILLESTROMBANKEN', 'LillestrømBanken', 'lillestrom.png', null, true, true, 'https://lillestrombanken.no/aktuelt/bankid-paa-mobil'),
  new BankVo('MARKER_SB', 'Marker Sparebank', 'marker.png', null, true, true, 'https://marker-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('MELHUSBANKEN', 'Melhusbanken', 'melhus.png', null, true, true, 'https://melhusbanken.no/aktuelt/bankid-paa-mobil'),
  new BankVo('NIDAROS_SB', 'Nidaros Sparebank', 'nidaros.png', null, true, true, 'https://nidaros-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('NORDIREKTEBANK', 'NORDirektebank (Skagerrak Sparebank)', 'nordirektebank.png', null, true, true, 'https://nordirektebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('ODAL_SB', 'Odal Sparebank', 'odal.png', null, true, true, 'https://odal-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('OFOTEN_SB', 'Ofoten Sparebank', 'ofoten.png', null, true, true, 'https://ofotensparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('OPPDALSBANKEN', 'Oppdalsbanken', 'oppdalsbanken.png', null, true, true, 'https://oppdalsbanken.no/aktuelt/bankid-paa-mobil'),
  new BankVo('ORKLA_SB', 'Orkla Sparebank', 'orkla.png', null, true, true, 'https://orklasparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('RINDAL_SB', 'Rindal Sparebank', 'rindal.png', null, true, true, 'https://rindalsbanken.no/aktuelt/bankid-paa-mobil'),
  new BankVo('ROMSDAL_SB', 'Romsdal Sparebank', 'romsdal.png', null, true, true, 'https://romsdalsbanken.no/aktuelt/bankid-paa-mobil'),
  new BankVo('ROROS', 'Rørosbanken', 'roros.png', null, true, true, 'https://rorosbanken.no/aktuelt/bankid-paa-mobil'),
  new BankVo('SANDNES_SB', 'Sandnes Sparebank', 'sandnes.png', null, true, true, 'https://sandnes-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('SELBU_SB', 'Selbu Sparebank', 'selbu.png', null, true, true, 'https://selbusparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('SKAGERRAK_SB', 'Skagerrak Sparebank', 'skagerrak.png', null, true, true, 'https://skagerraksparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('SKUE_SB', 'Skue Sparebank', 'skue.png', null, true, true, 'https://skuesparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('SOGN', 'Sogn Sparebank', 'sogn.png', null, true, true, 'https://sognbank.no//aktuelt/bankid-paa-mobil'),
  new BankVo('SOKNEDAL_SB', 'Soknedal Sparebank', 'soknedal.png', null, true, true, 'https://soknedal-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('SPAREBANKEN_DIN', 'Sparebanken DIN', 'sparebanken_din.png', null, true, true, 'https://sparebankendin.no/aktuelt/bankid-paa-mobil'),
  new BankVo('SB_NARVIK', 'Sparebanken Narvik', 'sparebanken_narvik.png', null, true, true, 'https://sn.no/aktuelt/bankid-paa-mobil'),
  new BankVo('STADSBYGD_SB', 'Stadsbygd Sparebank', 'stadsbygd.png', null, true, true, 'https://stbank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('STROMMEN_SB', 'Strømmen Sparebank', 'strommen.png', null, true, true, 'https://strommensparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('SUNNDAL_SB', 'Sunndal Sparebank', 'sunndal.png', null, true, true, 'https://sunndal-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('SURNADAL_SB', 'Surnadal Sparebank', 'surnadal.png', null, true, true, 'https://bank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('TINN_SB', 'Tinn Sparebank', 'tinn.png', null, true, true, 'https://tinnbank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('TOLGA_SB', 'Tolga-Os Sparebank', 'tolga.png', null, true, true, 'https://tos.no/aktuelt/bankid-paa-mobil'),
  new BankVo('TOTENS_SB', 'Totens Sparebank', 'toten.png', null, true, true, 'https://totenbanken.no/aktuelt/bankid-paa-mobil'),
  new BankVo('TROGSTAD_SB', 'Trøgstad Sparebank', 'trogstad.png', null, true, true, 'https://tsbank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('TYSNES_SB', 'Tysnes Sparebank', 'tysnes.png', null, true, true, 'https://tysnes-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('VALDRES_SB', 'Valdres Sparebank', 'valdres.png', null, true, true, 'https://valdressparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('VALLE_SB', 'Valle Sparebank', 'valle.png', null, true, true, 'https://valle-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('VEKSELBANKEN', 'Vekselbanken', 'vekselbanken.png', null, true, true, 'https://vekselbanken.no/aktuelt/bankid-paa-mobil'),
  new BankVo('ORLAND_SB', 'Ørland Sparebank', 'orland.png', null, true, true, 'https://orland-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('ORSKOG_SB', 'Ørskog Sparebank', 'orskog.png', null, true, true, 'https://orskogsparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('OSTRE_AGDER_SB', 'Østre Agder Sparebank', 'ostre_agder.png', null, true, true, 'https://oasparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('AFJORD_SB', 'Åfjord Sparebank', 'aafjord.png', null, true, true, 'https://afjord-sparebank.no/aktuelt/bankid-paa-mobil'),
  new BankVo('SPAREBANK_68', 'Sparebank 68 Grader Nord', '68nord.png', null, true, true, 'https://68nord.no//aktuelt/bankid-paa-mobil'),
  new BankVo('SPAREBANK_68', 'Harstad Sparebank', '68nord.png', null, true, true, 'https://68nord.no//aktuelt/bankid-paa-mobil'),
  new BankVo('SPAREBANK_68', 'Lofoten Sparebank', '68nord.png', null, true, true, 'https://68nord.no//aktuelt/bankid-paa-mobil')
];

export class BankUtils {

  static getBankByName(bankName:string):BankVo {
    const name = bankName.toUpperCase();
    for (const bank of BankList) {
      if (bank.name === name) {
        return bank;
      }
    }
    return null;
  }

  static getBankLogoUrl(bankName:string, basePath:string='../../../assets/img/banks-logo/'):string {
    const bank = this.getBankByName(bankName);
    if (bank.logo) {
      if (bank.logo.indexOf('.svg') > -1) {
        return basePath + 'svg/' + bank.logo;
      } else {
        return basePath + 'round/' + bank.logo;
      }
    } else {
      return basePath + 'wide/' + bank.icon;
    }
  }

}
