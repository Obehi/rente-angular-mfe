const express = require('express');
const path = require('path');
const app = express();
const https = require('https');
const clientPath = path.resolve(__dirname, '../dist/rente-front-end');
const port = process.env.PORT || 4302;
const baseUrl = process.env.BASE_URL;
const buildEnvConfig = require('../src/build-env-config.js');
const localeForLocalDev = process.argv[2] || 'no';
https.globalAgent.options.ca = require('ssl-root-cas/latest').create();

const proxy = require('http-proxy').createProxyServer({
  host: 'https://blogg.renteradar.no',
  changeOrigin: true,
  agent: new https.Agent({
    port: 443
  })
});

const historicalRatesProxy = require('http-proxy').createProxyServer({
  host: 'https://blogg.renteradar.no',
  changeOrigin: true
});

app.use('/api/historical-rates', function (req, res, next) {
  historicalRatesProxy.web(
    req,
    res,
    {
      target: baseUrl + '/loan/ext-services/historical-rates-statistics',
      auth: 'login:pass'
    },
    next
  );
});

buildEnvConfig(localeForLocalDev);

app.use(express.static(clientPath));

var renderIndex = (req, res) => {
  res.sendFile(path.resolve(__dirname, clientPath + '/index.html'));
};

app.get('/*', renderIndex);

// Start the app by listening on the default Heroku port
const server = app.listen(port, function () {
  let host = server.address().address;
  let port = server.address().port;
  host = host === '::' ? 'localhost' : host;
  console.log(`This express app is listening on: ${host}:${port}`);
});
