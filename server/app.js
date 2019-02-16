const express = require('express');
const path = require('path');
const app = express();
const favicon = require('serve-favicon');

const clientPath = path.resolve(__dirname, '../dist');
const port = process.env.PORT || 8080;

app.use(favicon(clientPath + '/favicon.ico'));
app.use(express.static(clientPath));

app.get('/*', function(req, res) {
  res.sendFile(path.resolve(__dirname, clientPath + '/index.html'));
});

// Start the app by listening on the default Heroku port
const server = app.listen(port, function () {
  let host = server.address().address;
  let port = server.address().port;
  host = (host === '::') ? 'localhost': host;
  console.log(`This express app is listening on: ${host}:${port}`);
});
