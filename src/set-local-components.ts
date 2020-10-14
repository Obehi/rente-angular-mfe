
//File replacement did not work with language interfaces when running heroku-postbuild (it works with ng serve...). This file is the workaround


const fs = require('fs');
const path = require('path');
const environment = process.env.ENV;
const locale = process.env.LOCALE
const isProd = environment === 'prod';
const mainPath = path.join(__dirname + `/app/local-components/components.ts`);
const svPath = path.join(__dirname + `/app/local-components/components-sv.ts`);
const noPath = path.join(__dirname + `/app/local-components/components-no.ts`);


// Setup Heroku configs
const envConfigFile = `
export const environment = {
  name: '${environment || "locale"}',
  production: ${isProd},
  baseUrl: '${process.env.BASE_URL}',
  crawlerUrl: '${process.env.CRAWLER_URL}'
};
`;




const svFile = `
  export { LoginSVComponent as LoginLangGenericComponent } from '@features/landing/locale/login/login-sv/login-sv.component';
  export { OffersListSvComponent as OffersListLangGenericComponent } from  '@features/dashboard/offers/offers-list/offers-list-sv/offers-list-sv.component';
`;
const noFile = `
  export { LoginNoComponent as LoginLangGenericComponent } from '@features/landing/locale/login/login-no/login-no.component';  

`;

const mockFile = svFile

let componentFile = "";

if(!process.env.LOCALE) {
  componentFile = mockFile;
} else if(process.env.LOCALE == "nb") {
  componentFile = noFile;
} else if(process.env.LOCALE == "sv") {
  componentFile = svFile;
}


if(process.env.LOCALE == null && componentFile != null) {
  console.log("Couldnt find LOCALE environment variable. Writing to locale mockup constant")
  console.log(mainPath)
  console.log("Couldnt find LOCALE environment variable. Writing to locale mockup constant")

  writeToComponentFile(componentFile, mainPath)
} else if(componentFile != null) {
  console.log("Couldnt find LOCALE environment variable")
  writeToComponentFile(componentFile, mainPath)
} else {
  process.on('exit', function(code) {
    return console.log(`About to exit with code ${code}`);
});
}


/* overwrite local component files which can be used for file replacement with "ng serve ...". 
This file is the source of truth, not the respective local files: "components-sv" and "components-nb". 
This file does not run before ng serve 
*/
if(process.env == null) {
  writeToComponentFile(svFile, svPath);
  writeToComponentFile(noFile, noPath);
}



function writeToComponentFile(file: string, path: string) {
  fs.writeFile(path, file, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Environment config generated at ${mainPath}. Environment mode is ${process.env.APP} `);
    console.log(envConfigFile);
  });
}