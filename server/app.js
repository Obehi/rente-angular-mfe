const express = require('express');
const path = require('path');
const app = express();
const https = require('https');

const clientPath = path.resolve(__dirname, '../dist/rente-front-end');
const port = process.env.PORT || 4300;

https.globalAgent.options.ca = require('ssl-root-cas/latest').create();

const proxy = require('http-proxy').createProxyServer({
  host: 'https://blogg.renteradar.no',
  changeOrigin: true,
  agent: new https.Agent({
    port: 443,
  })
});

if(process.env.LOCALE == undefined || process.env.LOCALE == "no") {
  app.use('/blogg', function(req, res, next) {
    proxy.web(req, res, {
        target: 'https://blogg.ranteradar.se'
    }, next);
  });
} else if(process.env.LOCALE == "sv") {
  app.use('/blogg', function(req, res, next) {
    proxy.web(req, res, {
        target: 'https://blogg.renteradar.no'
    }, next);
  });
}


app.use(express.static(clientPath));

var renderIndex = (req, res) => {
  res.sendFile(path.resolve(__dirname, clientPath + '/index.html'));
}

var renderSvIndex = (req, res) => {
  res.sendFile(path.resolve(__dirname, clientPath + '/sv' + '/index.html'))
}

//app.get('/*', renderSvIndex);
app.get('/*', renderIndex);

// Start the app by listening on the default Heroku port
const server = app.listen(port, function () {
  let host = server.address().address;
  let port = server.address().port;
  host = (host === '::') ? 'localhost' : host;
  console.log(`This express app is listening on: ${host}:${port}`);
  console.log("dir is: " + __dirname, clientPath + '/index.html');
});
