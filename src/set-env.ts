const fs = require('fs');
const path = require('path');
const environment = process.env.ENV;
const isProd = environment === 'prod';
const targetPath = path.join(__dirname + `/environments/environment.heroku.ts`);

// Setup Heroku configs
const envConfigFile = `
export const environment: Environment = {
  name: '${environment}',
  production: ${isProd},
  baseUrl: '${process.env.BASE_URL}',
  crawlerUrl: '${process.env.CRAWLER_URL}',
  tinkUrl: '${process.env.TINK_LINK}'
};

interface Environment { 
  name: string | null,
  production: boolean | null, 
  baseUrl: string | null,
  crawlerUrl: string | null,
  tinkUrl: string | null
}
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Environment config generated at ${targetPath}. Environment mode is ${process.env.APP} `);
  console.log(envConfigFile);
});
