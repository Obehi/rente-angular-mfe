export class BankVo {
  constructor(
    public name:string,
    public label:string,
    public icon:string,
    public logo:string = null,
    public loginWithSsn:boolean = false
  ) { }
}

export const BankList:BankVo[] = [
  new BankVo('DNB', 'DNB Bank ASA', 'dnb.png', null, true),
  new BankVo('NORDEA', 'NORDEA BANK ABP, FILIAL I NORGE', 'nordea.png'),
  // Sparebank 1
  new BankVo('SPAREBANK_1_BV', 'SpareBank 1 BV', null),
  new BankVo('SPAREBANK_1_GUDBRANDSDAL', 'SpareBank 1 Gudbrandsdal', null),
  new BankVo('SPAREBANK_1_HALLINGDAL_VALDRES', 'SpareBank 1 Hallingdal Valdres', null),
  new BankVo('SPAREBANK_1_LOM_OG_SKJAK', 'SpareBank 1 Lom og Skjåk', null),
  new BankVo('SPAREBANK_1_MODUM', 'SpareBank 1 Modum', null),
  new BankVo('SPAREBANK_1_NORD_NORGE', 'SpareBank 1 Nord-Norge', null),
  new BankVo('SPAREBANK_1_NORDVEST', 'SpareBank 1 Nordvest', null),
  new BankVo('SPAREBANK_1_RINGERIKE_HADELAND', 'SpareBank 1 Ringerike Hadeland', null),
  new BankVo('SPAREBANK_1_SMN', 'SpareBank 1 SMN', null),
  new BankVo('SPAREBANK_1_SR_BANK', 'SpareBank 1 SR-Bank', null),
  new BankVo('SPAREBANK_1_SORE_SUNNMORE', 'SpareBank 1 Søre Sunnmøre', null),
  new BankVo('SPAREBANK_1_TELEMARK', 'SpareBank 1 Telemark', null),
  new BankVo('SPAREBANK_1_OSTFOLD_AKERSHUS', 'SpareBank 1 Østfold Akershus', null),
  new BankVo('SPAREBANK_1_OSTLANDET', 'SpareBank 1 Østlandet', null),
  // EIKA banks
  new BankVo('AASEN_SB', 'Aasen Sparebank', 'aasen.png', null, true),
  new BankVo('ANDEBU_SB', 'Andebu Sparebank', 'andebu.png', null, true),
  new BankVo('ARENDAL_SK', 'Arendal og Omegns Sparekasse', 'EikaNewGreenThree.png', null, true),
  new BankVo('ARENDAL_SK', 'Sparekassa', 'EikaNewGreenThree.png', null, true),
  new BankVo('ASKIM_SB', 'Askim og Spydeberg Sparebank', 'askim.png', null, true),
  new BankVo('AURSKOG_SB', 'Aurskog Sparebank', null, null, true),
  new BankVo('BANK2', 'Bank2 ASA', null, null, true),
  new BankVo('BERG_SB', 'Berg Sparebank', null, null, true),
  new BankVo('BIEN', 'Bien Sparebank ASA', null, null, true),
  new BankVo('BIRKENES_SB', 'Birkenes Sparebank', null, null, true),
  new BankVo('BJUGN_SB', 'Bjugn Sparebank', null, null, true),
  new BankVo('BLAKER_SB', 'Blaker Sparebank', null, null, true),
  new BankVo('DRANGEDAL_SB', 'Drangedal Sparebank', null, null, true),
  new BankVo('EIDSBERG_SB', 'Eidsberg Sparebank', null, null, true),
  new BankVo('ETNEDAL_SB', 'Etnedal Sparebank', null, null, true),
  new BankVo('EVJE_SB', 'Evje og Hornnes Sparebank', null, null, true),
  new BankVo('FORNEBU_SB', 'Fornebu Sparebank', null, null, true),
  new BankVo('GILDESKAL_SB', 'Gildeskål Sparebank', null, null, true),
  new BankVo('GRONG_SB', 'Grong Sparebank', null, null, true),
  new BankVo('GRUE_SB', 'Grue Sparebank', null, null, true),
  new BankVo('HALTDALEN_SB', 'Haltdalen Sparebank', null, null, true),
  new BankVo('HEGRA_SB', 'Hegra Sparebank', null, null, true),
  new BankVo('HEMNE_SB', 'Hemne Sparebank', null, null, true),
  new BankVo('HJARTDAL_SB', 'Hjartdal og Gransherad Sparebank', null, null, true),
  new BankVo('HJELMELAND_SB', 'Hjelmeland Sparebank', null, null, true),
  new BankVo('HOLAND_SB', 'Høland og Setskog Sparebank', null, null, true),
  new BankVo('HONEFOSS_SB', 'Hønefoss Sparebank', null, null, true),
  new BankVo('JERNBANEPERSONALETS', 'Jernbanepersonalets Bank og Forsikring', null, null, true),
  new BankVo('JAEREN_SB', 'Jæren Sparebank', null, null, true),
  new BankVo('KVINESDAL_SB', 'Kvinesdal Sparebank', null, null, true),
  new BankVo('LARVIKBANKEN', 'Larvikbanken', null, null, true),
  new BankVo('LILLESTROMBANKEN', 'LillestrømBanken', null, null, true),
  new BankVo('MARKER_SB', 'Marker Sparebank', null, null, true),
  new BankVo('MELHUSBANKEN', 'Melhusbanken', null, null, true),
  new BankVo('NIDAROS_SB', 'Nidaros Sparebank', null, null, true),
  new BankVo('NORDIREKTEBANK', 'NORDirektebank (Skagerrak Sparebank)', null, null, true),
  new BankVo('ODAL_SB', 'Odal Sparebank', null, null, true),
  new BankVo('OFOTEN_SB', 'Ofoten Sparebank', null, null, true),
  new BankVo('OPPDALSBANKEN', 'Oppdalsbanken', null, null, true),
  new BankVo('ORKLA_SB', 'Orkla Sparebank', null, null, true),
  new BankVo('RINDAL_SB', 'Rindal Sparebank', null, null, true),
  new BankVo('ROMSDAL_SB', 'Romsdal Sparebank', null, null, true),
  new BankVo('ROROS', 'Rørosbanken', null, null, true),
  new BankVo('SANDNES_SB', 'Sandnes Sparebank', null, null, true),
  new BankVo('SELBU_SB', 'Selbu Sparebank', null, null, true),
  new BankVo('SKAGERRAK_SB', 'Skagerrak Sparebank', null, null, true),
  new BankVo('SKUE_SB', 'Skue Sparebank', null, null, true),
  new BankVo('SOGN', 'Sogn Sparebank', null, null, true),
  new BankVo('SOKNEDAL_SB', 'Soknedal Sparebank', null, null, true),
  new BankVo('SPAREBANKEN_DIN', 'Sparebanken DIN', null, null, true),
  new BankVo('SB_NARVIK', 'Sparebanken Narvik', null, null, true),
  new BankVo('STADSBYGD_SB', 'Stadsbygd Sparebank', null, null, true),
  new BankVo('STROMMEN_SB', 'Strømmen Sparebank', null, null, true),
  new BankVo('SUNNDAL_SB', 'Sunndal Sparebank', null, null, true),
  new BankVo('SURNADAL_SB', 'Surnadal Sparebank', null, null, true),
  new BankVo('TINN_SB', 'Tinn Sparebank', null, null, true),
  new BankVo('TOLGA_SB', 'Tolga-Os Sparebank', null, null, true),
  new BankVo('TOTENS_SB', 'Totens Sparebank', null, null, true),
  new BankVo('TROGSTAD_SB', 'Trøgstad Sparebank', null, null, true),
  new BankVo('TYSNES_SB', 'Tysnes Sparebank', null, null, true),
  new BankVo('VALDRES_SB', 'Valdres Sparebank', null, null, true),
  new BankVo('VALLE_SB', 'Valle Sparebank', null, null, true),
  new BankVo('VEKSELBANKEN', 'Vekselbanken', null, null, true),
  new BankVo('ORLAND_SB', 'Ørland Sparebank', null, null, true),
  new BankVo('ORSKOG_SB', 'Ørskog Sparebank', null, null, true),
  new BankVo('OSTRE_AGDER_SB', 'Østre Agder Sparebank', null, null, true),
  new BankVo('AFJORD_SB', 'Åfjord Sparebank', null, null, true),
  new BankVo('SPAREBANK_68', 'Sparebank 68 Grader Nord', '68Nord.png', null, true),
  new BankVo('SPAREBANK_68', 'Harstad Sparebank', '68Nord.png', null, true),
  new BankVo('SPAREBANK_68', 'Lofoten Sparebank', '68Nord.png', null, true)
];
