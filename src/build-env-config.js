var fs = require('fs')

const environment = process.env.ENV;
const isProd = environment === 'prod';

const envConfig = `window.ENV_CONFIG = {
    name: '${environment}',
    production: ${isProd},
    baseUrl: '${process.env.BASE_URL || 'https://rente-gateway-dev.herokuapp.com'}',
    crawlerUrl: '${process.env.CRAWLER_URL || 'https://rente-ws-dev.herokuapp.com/ws'}',
    tinkUrl: '${process.env.TINK_LINK}'
};
`
module.exports = (clientPath) => {
  fs.writeFile(`./env-config.js`, envConfig, 'utf8', function (err) {
     if (err) return console.log(err);
  });
  console.log(`Environment config generated. Environment mode is ${process.env.APP} `);
  console.log(envConfig);
}