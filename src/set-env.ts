const fs = require('fs');
const path = require('path');
const environment = process.env.ENV;
const isProd = environment === 'prod';
const targetPath = path.join(__dirname + `/environments/environment.heroku.ts`);

// Setup Heroku configs
const envConfigFile = `
export const environment: Environment = {
  name: '${environment}',
  production: ${isProd},
  baseUrl: '${process.env.BASE_URL}',
  crawlerUrl: '${process.env.CRAWLER_URL}',
  'locale": '${process.env.LOCALE}',
  tinkUrl: '${process.env.TINK_LINK}',
  "tinkNorDanskebankLink": "${process.env.TINK_NOR_DANSKEBANK_LINK}",
  "tinkNorHandelsbankenLink": "${process.env.TINK_NOR_HANDELSBANKEN_LINK}",
  coralogixApiUrl: '${process.env.CORALOGIX_API_URL}',
  coralogixPrivateKey: '${process.env.CORALOGIX_PRIVATE_KEY}',
  coralogixApplicationName: '${process.env.CORALOGIX_APPLICATION_NAME}'
  
};

interface Environment { 
  name: string | null,
  production: boolean | null, 
  baseUrl: string | null,
  crawlerUrl: string | null,
  tinkUrl: string | null,
  coralogixApiUrl: string | null,
  coralogixPrivateKey: string | null,
  coralogixApplicationName: string | null
}
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(
    `Environment config generated at ${targetPath}. Environment mode is ${process.env.APP} `
  );
  console.log(envConfigFile);
});
