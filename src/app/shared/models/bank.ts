export class BankVo {
  constructor(
    public name:string,
    public label:string,
    public icon:string,
    public logo:string = null,
    public loginWithSsn:boolean = false,
    public isEikaBank:boolean = false
  ) { }
}

export const BankList:BankVo[] = [
  new BankVo('DNB', 'DNB Bank ASA', 'dnb.png', 'dnb-color.svg', true),
  new BankVo('NORDEA', 'NORDEA BANK ABP, FILIAL I NORGE', 'nordea.png', 'nordea-color.svg'),
  // Sparebank 1
  new BankVo('SPAREBANK_1_BV', 'SpareBank 1 BV', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_GUDBRANDSDAL', 'SpareBank 1 Gudbrandsdal', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_HALLINGDAL_VALDRES', 'SpareBank 1 Hallingdal Valdres', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_LOM_OG_SKJAK', 'SpareBank 1 Lom og Skjåk', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_MODUM', 'SpareBank 1 Modum', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_NORD_NORGE', 'SpareBank 1 Nord-Norge', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_NORDVEST', 'SpareBank 1 Nordvest', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_RINGERIKE_HADELAND', 'SpareBank 1 Ringerike Hadeland', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_SMN', 'SpareBank 1 SMN', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_SR_BANK', 'SpareBank 1 SR-Bank', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_SORE_SUNNMORE', 'SpareBank 1 Søre Sunnmøre', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_TELEMARK', 'SpareBank 1 Telemark', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_OSTFOLD_AKERSHUS', 'SpareBank 1 Østfold Akershus', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  new BankVo('SPAREBANK_1_OSTLANDET', 'SpareBank 1 Østlandet', 'sparebanken1v2.png', 'sparebank1-color.svg'),
  // EIKA banks
  new BankVo('AASEN_SB', 'Aasen Sparebank', 'aasen.png', null, true, true),
  new BankVo('ANDEBU_SB', 'Andebu Sparebank', 'andebu.png', null, true, true),
  new BankVo('ARENDAL_SK', 'Arendal og Omegns Sparekasse', 'sparekassa_arendal.png', null, true, true),
  new BankVo('ARENDAL_SK', 'Sparekassa', 'sparekassa_arendal.png', null, true, true),
  new BankVo('ASKIM_SB', 'Askim og Spydeberg Sparebank', 'askim.png', null, true, true),
  new BankVo('AURSKOG_SB', 'Aurskog Sparebank', 'aurskog.png', null, true, true),
  new BankVo('BANK2', 'Bank2 ASA', 'bank2.png', null, true, true),
  new BankVo('BERG_SB', 'Berg Sparebank', 'berg.png', null, true, true),
  new BankVo('BIEN', 'Bien Sparebank ASA', 'bien.png', null, true, true),
  new BankVo('BIRKENES_SB', 'Birkenes Sparebank', 'birkenes.png', null, true, true),
  new BankVo('BJUGN_SB', 'Bjugn Sparebank', 'bjugn.png', null, true, true),
  new BankVo('BLAKER_SB', 'Blaker Sparebank', 'blaker.png', null, true, true),
  new BankVo('DRANGEDAL_SB', 'Drangedal Sparebank', 'drangedal.png', null, true, true),
  new BankVo('EIDSBERG_SB', 'Eidsberg Sparebank', 'eidsberg.png', null, true, true),
  new BankVo('ETNEDAL_SB', 'Etnedal Sparebank', 'etnedal.png', null, true, true),
  new BankVo('EVJE_SB', 'Evje og Hornnes Sparebank', 'evje_hornnes.png', null, true, true),
  new BankVo('FORNEBU_SB', 'Fornebu Sparebank', 'fornebu.png', null, true, true),
  new BankVo('GILDESKAL_SB', 'Gildeskål Sparebank', 'gildeskal.png', null, true, true),
  new BankVo('GRONG_SB', 'Grong Sparebank', 'grong.png', null, true, true),
  new BankVo('GRUE_SB', 'Grue Sparebank', 'grue.png', null, true, true),
  new BankVo('HALTDALEN_SB', 'Haltdalen Sparebank', 'haltdalen.png', null, true, true),
  new BankVo('HEGRA_SB', 'Hegra Sparebank', 'hegra.png', null, true, true),
  new BankVo('HEMNE_SB', 'Hemne Sparebank', 'hemne.png', null, true, true),
  new BankVo('HJARTDAL_SB', 'Hjartdal og Gransherad Sparebank', 'hjartdal.png', null, true, true),
  new BankVo('HJELMELAND_SB', 'Hjelmeland Sparebank', 'hjelmeland.png', null, true, true),
  new BankVo('HOLAND_SB', 'Høland og Setskog Sparebank', 'holand_setskog.png', null, true, true),
  new BankVo('HONEFOSS_SB', 'Hønefoss Sparebank', 'honefoss.png', null, true, true),
  new BankVo('JERNBANEPERSONALETS', 'Jernbanepersonalets Bank og Forsikring', 'jernbane.png', null, true, true),
  new BankVo('JAEREN_SB', 'Jæren Sparebank', 'jaeren.png', null, true, true),
  new BankVo('KVINESDAL_SB', 'Kvinesdal Sparebank', 'kvinesdal.png', null, true, true),
  new BankVo('LARVIKBANKEN', 'Larvikbanken', 'larvikbanken.png', null, true, true),
  new BankVo('LILLESTROMBANKEN', 'LillestrømBanken', 'lillestrom.png', null, true, true),
  new BankVo('MARKER_SB', 'Marker Sparebank', 'marker.png', null, true, true),
  new BankVo('MELHUSBANKEN', 'Melhusbanken', 'melhus.png', null, true, true),
  new BankVo('NIDAROS_SB', 'Nidaros Sparebank', 'nidaros.png', null, true, true),
  new BankVo('NORDIREKTEBANK', 'NORDirektebank (Skagerrak Sparebank)', 'nordirektebank.png', null, true, true),
  new BankVo('ODAL_SB', 'Odal Sparebank', 'odal.png', null, true, true),
  new BankVo('OFOTEN_SB', 'Ofoten Sparebank', 'ofoten.png', null, true, true),
  new BankVo('OPPDALSBANKEN', 'Oppdalsbanken', 'oppdalsbanken.png', null, true, true),
  new BankVo('ORKLA_SB', 'Orkla Sparebank', 'orkla.png', null, true, true),
  new BankVo('RINDAL_SB', 'Rindal Sparebank', 'rindal.png', null, true, true),
  new BankVo('ROMSDAL_SB', 'Romsdal Sparebank', 'romsdal.png', null, true, true),
  new BankVo('ROROS', 'Rørosbanken', 'roros.png', null, true, true),
  new BankVo('SANDNES_SB', 'Sandnes Sparebank', 'sandnes.png', null, true, true),
  new BankVo('SELBU_SB', 'Selbu Sparebank', 'selbu.png', null, true, true),
  new BankVo('SKAGERRAK_SB', 'Skagerrak Sparebank', 'skagerrak.png', null, true, true),
  new BankVo('SKUE_SB', 'Skue Sparebank', 'skue.png', null, true, true),
  new BankVo('SOGN', 'Sogn Sparebank', 'sogn.png', null, true, true),
  new BankVo('SOKNEDAL_SB', 'Soknedal Sparebank', 'soknedal.png', null, true, true),
  new BankVo('SPAREBANKEN_DIN', 'Sparebanken DIN', 'sparebanken_din.png', null, true, true),
  new BankVo('SB_NARVIK', 'Sparebanken Narvik', 'sparebanken_narvik.png', null, true, true),
  new BankVo('STADSBYGD_SB', 'Stadsbygd Sparebank', 'stadsbygd.png', null, true, true),
  new BankVo('STROMMEN_SB', 'Strømmen Sparebank', 'strommen.png', null, true, true),
  new BankVo('SUNNDAL_SB', 'Sunndal Sparebank', 'sunndal.png', null, true, true),
  new BankVo('SURNADAL_SB', 'Surnadal Sparebank', 'surnadal.png', null, true, true),
  new BankVo('TINN_SB', 'Tinn Sparebank', 'tinn.png', null, true, true),
  new BankVo('TOLGA_SB', 'Tolga-Os Sparebank', 'tolga.png', null, true, true),
  new BankVo('TOTENS_SB', 'Totens Sparebank', 'toten.png', null, true, true),
  new BankVo('TROGSTAD_SB', 'Trøgstad Sparebank', 'trogstad.png', null, true, true),
  new BankVo('TYSNES_SB', 'Tysnes Sparebank', 'tysnes.png', null, true, true),
  new BankVo('VALDRES_SB', 'Valdres Sparebank', 'valdres.png', null, true, true),
  new BankVo('VALLE_SB', 'Valle Sparebank', 'valle.png', null, true, true),
  new BankVo('VEKSELBANKEN', 'Vekselbanken', 'vekselbanken.png', null, true, true),
  new BankVo('ORLAND_SB', 'Ørland Sparebank', 'orland.png', null, true, true),
  new BankVo('ORSKOG_SB', 'Ørskog Sparebank', 'orskog.png', null, true, true),
  new BankVo('OSTRE_AGDER_SB', 'Østre Agder Sparebank', 'ostre_agder.png', null, true, true),
  new BankVo('AFJORD_SB', 'Åfjord Sparebank', 'aafjord.png', null, true, true),
  new BankVo('SPAREBANK_68', 'Sparebank 68 Grader Nord', '68nord.png', null, true, true),
  new BankVo('SPAREBANK_68', 'Harstad Sparebank', '68nord.png', null, true, true),
  new BankVo('SPAREBANK_68', 'Lofoten Sparebank', '68nord.png', null, true, true)
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
