const express = require('express');
const path = require('path');
const app = express();
const https = require('https');

const clientPath = path.resolve(__dirname, '../dist/rente-front-end');
const port = process.env.PORT || 4300;
const baseUrl = process.env.BASE_URL;

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

app.use('/redirect', function(req, res, next) {
  var link = "fb-messenger://share?link=https://renteradar.no/&&app_id=326133992135942"
  

 
/*   let obj = {}
  if(detectMob){
    link = "fb-messenger://share?link=https://renteradar.no/&&app_id=326133992135942"
    obj =   {}
  } else {
    link = "https://www.facebook.com/dialog/send?app_id=326133992135942&link=https%3A%2F%2Frente-frontend-dev.herokuapp.com%2F%3Fgrsf%3Dmidspm&redirect_uri=https%3A%2F%2Frente-frontend-dev.herokuapp.com%2F"
    obj=   {
      target: link
    }
  } */
  if(!detectMob){
    console.log("not phone")
    proxy.web(req, res, {
      target: "https://www.facebook.com/dialog/send?app_id=326133992135942&link=https%3A%2F%2Frente-frontend-dev.herokuapp.com%2F%3Fgrsf%3Dmidspm&redirect_uri=https%3A%2F%2Frente-frontend-dev.herokuapp.com%2F"
  }, next);
  } else {
    next()
  }
  
});

function detectMob() {
  const toMatch = [
      /Android/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
  ];

  return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
  });
}


const historicalRatesProxy = require('http-proxy').createProxyServer({
  host: 'https://blogg.renteradar.no',
  changeOrigin: true
});

 app.use('/api/historical-rates', function(req, res, next) {
   historicalRatesProxy.web(req, res, {
      target: baseUrl + '/loan/ext-services/historical-rates-statistics',
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
