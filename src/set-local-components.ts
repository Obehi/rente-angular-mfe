
//File replacement did not work with language interfaces when running heroku-postbuild (it works with ng serve...). This file is the workaround


const fs = require('fs');
const path = require('path');
const environment = process.env.ENV;
const locale = process.env.LOCALE || require('./app/config/locale/locale-js')
const isProd = environment === 'prod';
const mainPath = path.join(__dirname + `/app/local-components/components-output.ts`);
const svPath = path.join(__dirname + `/app/local-components/components-sv.ts`);
const noPath = path.join(__dirname + `/app/local-components/components-no.ts`);


const svFile = `
  export { LoginSVComponent as LoginLangGenericComponent } from '@features/landing/locale/login/login-sv/login-sv.component';
  export { OffersListSvComponent as OffersListLangGenericComponent } from  '@features/dashboard/offers/offers-list/offers-list-sv/offers-list-sv.component';
  export { HeaderSvComponent as HeaderLangGenericComponent } from '@shared/components/header/header-sv/header-sv.component';
  export { LoansSvComponent as LoansLangGenericComponent } from '@features/dashboard/loans/loans-blue/loans-sv/loans-sv.component'


`;
const noFile = `
  export { LoginNoComponent as LoginLangGenericComponent } from '@features/landing/locale/login/login-no/login-no.component';  
  export { OffersListNoComponent as OffersListLangGenericComponent } from  '@features/dashboard/offers/offers-list/offers-list-no/offers-list-no.component';
  export { HeaderNoComponent as HeaderLangGenericComponent } from '@shared/components/header/header-no/header-no.component';
  export { LoansNoComponent as LoansLangGenericComponent } from '@features/dashboard/loans/loans-blue/loans-no/loans-no.component'



`;

const mockFile = noFile

let componentFile = "";

console.log("locale in set-local-components.ts: " + locale)
if(!locale) {
  console.log("Couldnt find locale variable neither in environmen or in config/locale.ts");
  componentFile = mockFile;
} else if(locale == "nb") {
  componentFile = noFile;
} else if(locale == "sv") {
  componentFile = svFile;
} else {
  console.log("set-local-components.ts: couldnt find locale: " + componentFile)
  process.exit(1);
}


if(locale == null && componentFile != null) {
  console.log("Couldnt find LOCALE environment variable. Writing to locale mockup constant")
  console.log(mainPath)
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



function writeToComponentFile(file, path) {
  fs.writeFile(path, file, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Local component export file generated at ${mainPath}. Environment mode is ${process.env.APP} `);
    console.log(componentFile);
  });
}