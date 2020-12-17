var fs = require('fs')

const environment = process.env.ENV;
const isProd = environment === 'prod';


module.exports = (clientPath) => {

  const envConfig = `window.ENV_CONFIG = {
    name: '${environment}',
    production: ${isProd},
    baseUrl: '${process.env.BASE_URL || 'https://rente-gateway-dev.herokuapp.com'}',
    crawlerUrl: '${process.env.CRAWLER_URL || 'https://rente-ws-dev.herokuapp.com/ws'}',
    tinkUrl: '${process.env.TINK_LINK}',
    locale: '${process.env.LOCALE}',
    test: '${process.env.LOCALE}'
};
`

  fs.writeFile(`../dist/rente-front-end/env-config.js`, envConfig, 'utf8', function (err) {
     if (err) return console.log(err);
  });
  console.log(`Environment config generated. Environment mode is ${process.env.APP} `);
  console.log(envConfig);
}