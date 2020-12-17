var fs = require("fs");
var path =  require('path');

const environment = process.env.ENV;
const isProd = environment === "prod";
const localeForLocalDev = process.argv[2] || "no";
const isServe = process.argv[3] || "serve";
const isLocal = process.env.ENV === undefined;

module.exports = (clientPath) => {
  const localEnvConfig = `export const environment = {
    name: 'local',
    production: '${isProd}',
    baseUrl: true,
    crawlerUrl: 'https://rente-ws-dev.herokuapp.com/ws',
    tinkUrl: '${
      localeForLocalDev === "no"
        ? ""
        : localeForLocalDev === "sv"
        ? "https://link.tink.com/1.0/authorize/?client_id=3973e78ee8c140edbf36e53d50132ba1&redirect_uri=https%3A%2F%2Franteradar.se&scope=accounts:read,identity:read&market=SE&locale=sv_SE&iframe=true"
        : null
    }',
    locale: '${
      localeForLocalDev === "no"
        ? "nb"
        : localeForLocalDev === "sv"
        ? "sv"
        : null
    }'
  };
  `;

  const envConfig = `export const remoteEnvironment ={
    name: '${environment}',
    production: ${isProd},
    baseUrl: '${process.env.BASE_URL}',
    crawlerUrl: '${process.env.CRAWLER_URL}',
    tinkUrl: '${process.env.TINK_LINK}',
    locale: '${process.env.LOCALE}',
  };
  `;


  let outputFile = isLocal ? localEnvConfig : envConfig;
  let outputPath = isServe
    ? "./dist/rente-front-end/env-config.js"
    : "../dist/rente-front-end/env-config.js";


  if(isServe) {
    createDirectories('../dist/rente-front-end/', () => {

      fs.writeFile('./dist/rente-front-end/env-config.js', outputFile, "utf8", function (err) {
        if (err) return console.log(err);
      });
    })
  } else {
    fs.writeFile(outputPath, outputFile, "utf8", function (err) {
      if (err) return console.log(err);
    });
  }
  
  console.log(
    `Environment config generated. Environment mode is ${process.env.APP} `
  );
  console.log(outputFile);
};


function createDirectories(pathname, callback) {
  const __dirname = path.resolve();
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
  fs.mkdir(path.resolve(__dirname, pathname), { recursive: true }, e => {
      if (e) {
          console.error(e);
      } else {
          callback()
      }
   });
}