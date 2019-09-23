const express = require('express');
const path = require('path');
const app = express();
// const requestProxy = require("express-request-proxy");
const proxy = require('http-proxy-middleware');
//const favicon = require('serve-favicon');

const clientPath = path.resolve(__dirname, '../dist/rente-front-end');
const port = process.env.PORT || 4300;

//app.use(favicon(clientPath + '/favicon.ico'));
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
