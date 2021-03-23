export const environment = {
  name: 'local',
  production: false,
  baseUrl: 'https://rente-gateway-dev.herokuapp.com',
  crawlerUrl: 'https://rente-ws-dev.herokuapp.com/ws',
  tinkUrl:
    'https://link.tink.com/1.0/authorize/?client_id=3973e78ee8c140edbf36e53d50132ba1&redirect_uri=https%3A%2F%2Franteradar.se&scope=accounts:read,identity:read&market=SE&locale=sv_SE&iframe=true',
  locale: 'sv',
  tinkNorDanskebankLink:
    'https://link.tink.com/1.0/authorize/credentials/no-danskebank-password?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frenteradar.no&scope=accounts:read,credentials:read&market=NO&locale=no_NO&iframe=true',
  tinkNorHandelsbankenLink:
    'https://link.tink.com/1.0/authorize/credentials/no-handelsbanken-bankid?client_id=690cbe68c3df412082d5ad8a5a2335d8&redirect_uri=https%3A%2F%2Frenteradar.no&scope=accounts:read,credentials:read&market=NO&locale=no_NO&iframe=true',
  coralogixApiUrl: 'https://api.coralogix.com/api/v1/logs',
  coralogixPrivateKey: '92caa3a2-90d2-9f01-7d00-077afb69d8e5',
  coralogixApplicationName: 'rente-frontend-prod_13639',
  loginDnbIsOn: true
};
