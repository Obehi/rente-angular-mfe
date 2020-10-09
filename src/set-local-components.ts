const fs = require('fs');
const path = require('path');
const environment = process.env.ENV;
const locale = procces.env.LOCALE
const isProd = environment === 'prod';
const targetPath = path.join(__dirname + `/environments/components/components.ts`);


// Setup Heroku configs
const envConfigFile = `
export const environment = {
  name: '${environment || "locale"}',
  production: ${isProd},
  baseUrl: '${process.env.BASE_URL}',
  crawlerUrl: '${process.env.CRAWLER_URL}'
};
`;


const componentsFile = `
  export { LoginSVComponent as LoginLangGenericComponent } from '@features/landing/locale/login/login-sv/login-sv.component';
`;




fs.writeFile(targetPath, componentsFile, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Environment config generated at ${targetPath}. Environment mode is ${process.env.APP} `);
  console.log(envConfigFile);
});
