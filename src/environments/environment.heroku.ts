export const environment: Environment = {
  name: 'undefined',
  production: false,
  baseUrl: 'undefined',
  crawlerUrl: 'undefined',
  locale: 'undefined',
  tinkUrl: 'undefined',
  tinkNorDanskebankLink: 'undefined',
  tinkNorHandelsbankenLink: 'undefined',
  coralogixApiUrl: 'undefined',
  coralogixPrivateKey: 'undefined',
  coralogixApplicationName: 'undefined'
};

interface Environment {
  name: string | null;
  production: boolean | null;
  baseUrl: string | null;
  crawlerUrl: string | null;
  tinkUrl: string | null;
  locale: string | null;
  tinkNorDanskebankLink: string | null;
  tinkNorHandelsbankenLink: string | null;
  coralogixApiUrl: string | null;
  coralogixPrivateKey: string | null;
  coralogixApplicationName: string | null;
}
