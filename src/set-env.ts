const fs = require('fs');
const path = require('path');
const environment = process.env.ENV;
const isProd = environment === 'prod';
const targetPath = path.join(__dirname + `/environments/environment.heroku.ts`);

// Setup Heroku configs
const envConfigFile = `
export const environment = {
  name: '${environment}',
  production: ${isProd},
  baseUrl: '${process.env.BASE_URL}',
  crawlerUrl: '${process.env.CRAWLER_URL}'
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Environment config generated at ${targetPath}. Environment mode is ${process.env.APP} `);
  console.log(envConfigFile);
});