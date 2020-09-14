const express = require('express');
const path = require('path');
const app = express();
const https = require('https');

const clientPath = path.resolve(__dirname, '../dist/rente-front-end');
const port = process.env.PORT || 4300;
const baseUrl = process.env.PORT || 'https://rente-loan-dev.herokuapp.com/';

https.globalAgent.options.ca = require('ssl-root-cas/latest').create();

const proxy = require('http-proxy').createProxyServer({
  host: 'https://blogg.renteradar.no',
  changeOrigin: true,
  agent: new https.Agent({
    port: 443,
  })
});

app.use('/blogg', function(req, res, next) {
  proxy.web(req, res, {
      target: 'https://blogg.renteradar.no'
  }, next);
});



const historicalRatesProxy = require('http-proxy').createProxyServer({
  host: 'https://blogg.renteradar.no',
  changeOrigin: true,
  agent: new https.Agent({
    port: 443,
    auth: 'login:pass'
  })
});

 app.use('/api/historical-rates', function(req, res, next) {
   console.log(req.headers);
   console.log(req.headers.authorization);
   console.log(req.query);
   historicalRatesProxy.web(req, res, {
      target: baseUrl + 'ext-services/bank-statistics',
      auth: 'login:pass'
  }, next); 
});
 

app.use(express.static(clientPath));

var renderIndex = (req, res) => {
  res.sendFile(path.resolve(__dirname, clientPath + '/index.html'));
}

var renderEnIndex = (req, res) => {
  res.sendFile(path.resolve(__dirname, clientPath + '/en' + '/index.html'))
}

app.get('/en*', renderEnIndex);
app.get('/*', renderIndex);

// Start the app by listening on the default Heroku port
const server = app.listen(port, function () {
  let host = server.address().address;
  let port = server.address().port;
  host = (host === '::') ? 'localhost' : host;
  console.log(`This express app is listening on: ${host}:${port}`);
});
