export const VALIDATION_PATTERN = {
  email: [
    '^(([^<>()[\\]\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\"]+)*)|',
    '(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|',
    '(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
  ].join(''),
  ssn: '^[0-9]{11}$',
  ssnMasked: '^([0-9]{6}) ([0-9]{5})$',
  phoneShort: '[0-9]{8}$',
  phoneShortSv: '[0-9]{10}$',
  dob: '^(0?0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])([0-9]{2})$',
  number: '^[0-9]+$',
  thousandsAsString: '^([0-9]|\\s)+$',
  zip: '^[0-9]{4}$',
  zipSWE: '[0-9 ]+',
  rate: '^\\d(\\,|\\.)\\d{1,3}$|^\\d{1}$',
  nonNullThousand: '0*[1-9][0-9]*',
  /*
   * Can not start with 0, but can start with 0,3.
   * Can start with 1 or 2 numbers preceeded by 1 or two decimals.
   * Can start with 1 or two numbers. Can start with 1 or two numbers preceeded by , or .
   */
  year:
    '(?!(0(?!(\\,|\\.))))(^\\d{1,2}(\\,|\\.)\\d$|^\\d{1,2}$|^\\d{1,2}(\\,|\\.)$)'
};
