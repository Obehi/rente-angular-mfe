var fs = require('fs');
var path = require('path');

const environment = process.env.ENV;
const isProd = environment === 'prod';
const isLocal = process.env.ENV === undefined;

module.exports = (localeForLocalDev) => {
  const localEnvConfig = `{
    "name": "local",
    "production": false,
    "baseUrl": "https://rente-gateway-dev.herokuapp.com",
    "crawlerUrl": "https://rente-ws-dev.herokuapp.com/ws",
    "tinkUrl": "${
      localeForLocalDev === 'no'
        ? 'norskTikLink'
        : localeForLocalDev === 'sv'
        ? 'https://link.tink.com/1.0/authorize/?client_id=3973e78ee8c140edbf36e53d50132ba1&redirect_uri=https%3A%2F%2Franteradar.se&scope=accounts:read,identity:read&market=SE&locale=sv_SE&iframe=true'
        : null
    }",
    "locale": "${
      localeForLocalDev === 'no'
        ? 'nb'
        : localeForLocalDev === 'sv'
        ? 'sv'
        : null
    }"
  }
  `;

  const envConfig = `{
    "name": "${environment}",
    "production": "${isProd}",
    "baseUrl": "${process.env.BASE_URL}",
    "crawlerUrl": "${process.env.CRAWLER_URL}",
    "locale": "${process.env.LOCALE}",
    "shouldLog": "${process.env.SHOULD_LOG}",
    "tinkUrl": "${process.env.TINK_LINK}",
    "tinkNorDanskebankLink": "${process.env.TINK_NOR_DANSKEBANK_LINK}",
    "tinkNorHandelsbankenLink": "${process.env.TINK_NOR_HANDELSBANKEN_LINK}",
    "coralogixApiUrl": "${process.env.CORALOGIX_API_URL}",
    "coralogixPrivateKey": "${process.env.CORALOGIX_PRIVATE_KEY}",
    "coralogixApplicationName": "${process.env.CORALOGIX_APPLICATION_NAME}"
  }
  `;

  let outputFile = envConfig;
  let outputPath = '../dist/rente-front-end/assets/env-config.json';

  createDirectories(outputPath, () => {
    fs.writeFile(outputPath, outputFile, 'utf8', function (err) {
      if (err) return console.log(err);
    });
    console.log(
      `Environment config generated. Environment mode is ${process.env.APP} `
    );
  });
};

function createDirectories(pathname, callback) {
  const __dirname = path.resolve();
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
  fs.mkdir(path.resolve(__dirname, pathname), { recursive: true }, (e) => {
    if (e) {
      console.error(e);
    } else {
      console.log('created env file at ' + pathname);
      callback();
    }
  });
}
